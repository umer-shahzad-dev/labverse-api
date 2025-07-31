import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPlanQuotation, QuotationStatus } from './entities/client-plan-quotation.entity';
import { CreateClientPlanQuotationDto } from './dto/create-client-plan-quotation.dto';
import { UpdateClientPlanQuotationDto } from './dto/update-client-plan-quotation.dto';
import { User } from './../users/entities/user.entity';
import { DevelopmentPlan } from './../development-plans/entities/development-plan.entity';
import { DevelopmentPlansService } from '../../modules/development-plans/development-plans.service'; // To calculate plan price

@Injectable()
export class ClientPlanQuotationsService {
    constructor(
        @InjectRepository(ClientPlanQuotation)
        private clientPlanQuotationRepository: Repository<ClientPlanQuotation>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(DevelopmentPlan)
        private developmentPlanRepository: Repository<DevelopmentPlan>,
        private developmentPlansService: DevelopmentPlansService, // Inject DevelopmentPlansService for price calculation
    ) { }

    private async generateQuotationCode(): Promise<string> {
        let code: string;
        let isUnique = false;
        do {
            // Generate a simple code (e.g., Q-YYYYMMDD-XXXX)
            const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 4 random chars
            code = `Q-${datePart}-${randomPart}`;
            const existing = await this.clientPlanQuotationRepository.findOne({ where: { quotationCode: code } });
            isUnique = !existing;
        } while (!isUnique);
        return code;
    }

    async create(createQuotationDto: CreateClientPlanQuotationDto): Promise<ClientPlanQuotation> {
        const { clientId, developmentPlanId, quotedPrice, status, validUntil, notes } = createQuotationDto;

        const client = await this.userRepository.findOne({ where: { id: clientId } });
        if (!client) {
            throw new NotFoundException(`Client (User) with ID "${clientId}" not found.`);
        }

        const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: developmentPlanId } });
        if (!developmentPlan) {
            throw new NotFoundException(`Development Plan with ID "${developmentPlanId}" not found.`);
        }

        const quotationCode = await this.generateQuotationCode();

        let finalQuotedPrice = quotedPrice;
        if (finalQuotedPrice === undefined || finalQuotedPrice === null) {
            // If quotedPrice is not provided, calculate it from the plan
            const planDetails = await this.developmentPlansService.findOne(developmentPlanId); // This loads relations
            finalQuotedPrice = planDetails.basePrice;

            // Add prices from associated features
            if (planDetails.planFeatures && planDetails.planFeatures.length > 0) {
                finalQuotedPrice += planDetails.planFeatures.reduce((sum, dpf) => sum + (dpf.priceAdjustment || dpf.planFeature.defaultPriceAdjustment || 0), 0);
            }

            // Add prices from associated services
            if (planDetails.planServices && planDetails.planServices.length > 0) {
                finalQuotedPrice += planDetails.planServices.reduce((sum, dps) => sum + ((dps.customPrice || dps.service.defaultPrice || 0) * (dps.quantity || 1)), 0);
            }
            // Technologies typically don't add to price directly, but if they did, add logic here.
        }

        const quotation = this.clientPlanQuotationRepository.create({
            client,
            developmentPlan,
            clientId,
            developmentPlanId,
            quotationCode,
            quotedPrice: finalQuotedPrice,
            status: status || QuotationStatus.DRAFT,
            validUntil: validUntil ? new Date(validUntil) : null,
            notes,
        });

        return this.clientPlanQuotationRepository.save(quotation);
    }

    async findAll(): Promise<ClientPlanQuotation[]> {
        return this.clientPlanQuotationRepository.find({
            relations: ['client', 'developmentPlan'],
            // Replace 'createdAt' with a valid column name, e.g., 'created_at' or 'id'
            order: { id: 'DESC' },
        });
    }

    async findOne(id: string): Promise<ClientPlanQuotation> {
        const quotation = await this.clientPlanQuotationRepository.findOne({
            where: { id },
            relations: ['client', 'developmentPlan'],
        });
        if (!quotation) {
            throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found.`);
        }
        return quotation;
    }

    async update(id: string, updateQuotationDto: UpdateClientPlanQuotationDto): Promise<ClientPlanQuotation> {
        const quotation = await this.clientPlanQuotationRepository.findOne({ where: { id } });
        if (!quotation) {
            throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found.`);
        }

        // Handle potential updates to client or development plan if they are changed
        if (updateQuotationDto.clientId && updateQuotationDto.clientId !== quotation.clientId) {
            const client = await this.userRepository.findOne({ where: { id: updateQuotationDto.clientId } });
            if (!client) throw new NotFoundException(`Client (User) with ID "${updateQuotationDto.clientId}" not found.`);
            quotation.client = client;
            quotation.clientId = updateQuotationDto.clientId;
        }

        if (updateQuotationDto.developmentPlanId && updateQuotationDto.developmentPlanId !== quotation.developmentPlanId) {
            const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: updateQuotationDto.developmentPlanId } });
            if (!developmentPlan) throw new NotFoundException(`Development Plan with ID "${updateQuotationDto.developmentPlanId}" not found.`);
            quotation.developmentPlan = developmentPlan;
            quotation.developmentPlanId = updateQuotationDto.developmentPlanId;
        }

        // Only recalculate price if developmentPlanId changes and no quotedPrice is provided in DTO
        if (updateQuotationDto.developmentPlanId && updateQuotationDto.developmentPlanId !== quotation.developmentPlanId && updateQuotationDto.quotedPrice === undefined) {
            const planDetails = await this.developmentPlansService.findOne(updateQuotationDto.developmentPlanId);
            let newCalculatedPrice = planDetails.basePrice;
            if (planDetails.planFeatures && planDetails.planFeatures.length > 0) {
                newCalculatedPrice += planDetails.planFeatures.reduce((sum, dpf) => sum + (dpf.priceAdjustment || dpf.planFeature.defaultPriceAdjustment || 0), 0);
            }
            if (planDetails.planServices && planDetails.planServices.length > 0) {
                newCalculatedPrice += planDetails.planServices.reduce((sum, dps) => sum + ((dps.customPrice || dps.service.defaultPrice || 0) * (dps.quantity || 1)), 0);
            }
            quotation.quotedPrice = newCalculatedPrice;
        } else if (updateQuotationDto.quotedPrice !== undefined) {
            // If quotedPrice is explicitly provided in DTO, use it
            quotation.quotedPrice = updateQuotationDto.quotedPrice;
        }

        if (updateQuotationDto.status !== undefined) {
            quotation.status = updateQuotationDto.status;
        }
        if (updateQuotationDto.validUntil !== undefined) {
            quotation.validUntil = updateQuotationDto.validUntil ? new Date(updateQuotationDto.validUntil) : null;
        }
        if (updateQuotationDto.notes !== undefined) {
            quotation.notes = updateQuotationDto.notes;
        }

        return this.clientPlanQuotationRepository.save(quotation);
    }

    async remove(id: string): Promise<void> {
        const result = await this.clientPlanQuotationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found.`);
        }
    }

    // --- Additional API for managing quotation status (as per milestone) ---
    async updateQuotationStatus(id: string, newStatus: QuotationStatus): Promise<ClientPlanQuotation> {
        const quotation = await this.clientPlanQuotationRepository.findOne({ where: { id } });
        if (!quotation) {
            throw new NotFoundException(`Client Plan Quotation with ID "${id}" not found.`);
        }

        // Add any business logic for status transitions here if needed
        // e.g., cannot change from ACCEPTED to DRAFT

        quotation.status = newStatus;
        return this.clientPlanQuotationRepository.save(quotation);
    }
}