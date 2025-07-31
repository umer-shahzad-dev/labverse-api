import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanService } from './entities/development-plan-service.entity';
import { CreateDevelopmentPlanServiceDto } from './dto/create-development-plan-service.dto';
import { UpdateDevelopmentPlanServiceDto } from './dto/update-development-plan-service.dto';
import { DevelopmentPlan } from './entities/development-plan.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class DevelopmentPlanServicesService {
    constructor(
        @InjectRepository(DevelopmentPlanService)
        private dpsRepository: Repository<DevelopmentPlanService>,
        @InjectRepository(DevelopmentPlan)
        private developmentPlanRepository: Repository<DevelopmentPlan>,
        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,
    ) { }

    async create(createDpsDto: CreateDevelopmentPlanServiceDto): Promise<DevelopmentPlanService> {
        const { developmentPlanId, serviceId, customPrice, quantity, notes } = createDpsDto;

        const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: developmentPlanId } });
        if (!developmentPlan) {
            throw new NotFoundException(`Development Plan with ID "${developmentPlanId}" not found.`);
        }

        const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
        if (!service) {
            throw new NotFoundException(`Service with ID "${serviceId}" not found.`);
        }

        const existingEntry = await this.dpsRepository.findOne({
            where: { developmentPlanId, serviceId },
        });
        if (existingEntry) {
            throw new ConflictException(`Service "${service.name}" is already associated with Development Plan "${developmentPlan.name}".`);
        }

        const dps = this.dpsRepository.create({
            developmentPlan,
            service,
            developmentPlanId,
            serviceId,
            customPrice: customPrice !== undefined ? customPrice : service.defaultPrice,
            quantity,
            notes,
        });

        return this.dpsRepository.save(dps);
    }

    async findAll(): Promise<DevelopmentPlanService[]> {
        return this.dpsRepository.find({
            relations: ['developmentPlan', 'service'],
        });
    }

    async findOne(id: string): Promise<DevelopmentPlanService> {
        const dps = await this.dpsRepository.findOne({
            where: { id },
            relations: ['developmentPlan', 'service'],
        });
        if (!dps) {
            throw new NotFoundException(`Development Plan Service with ID "${id}" not found.`);
        }
        return dps;
    }

    async update(id: string, updateDpsDto: UpdateDevelopmentPlanServiceDto): Promise<DevelopmentPlanService> {
        const dps = await this.dpsRepository.findOne({ where: { id } });
        if (!dps) {
            throw new NotFoundException(`Development Plan Service with ID "${id}" not found.`);
        }

        if (updateDpsDto.developmentPlanId || updateDpsDto.serviceId) {
            const newDevelopmentPlanId = updateDpsDto.developmentPlanId || dps.developmentPlanId;
            const newServiceId = updateDpsDto.serviceId || dps.serviceId;

            if (newDevelopmentPlanId !== dps.developmentPlanId || newServiceId !== dps.serviceId) {
                const existingEntry = await this.dpsRepository.findOne({
                    where: { developmentPlanId: newDevelopmentPlanId, serviceId: newServiceId },
                });
                if (existingEntry && existingEntry.id !== id) {
                    throw new ConflictException(`This Development Plan Service association already exists.`);
                }
            }
        }

        if (updateDpsDto.developmentPlanId && updateDpsDto.developmentPlanId !== dps.developmentPlanId) {
            const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: updateDpsDto.developmentPlanId } });
            if (!developmentPlan) {
                throw new NotFoundException(`Development Plan with ID "${updateDpsDto.developmentPlanId}" not found.`);
            }
            dps.developmentPlan = developmentPlan;
            dps.developmentPlanId = updateDpsDto.developmentPlanId;
        }

        if (updateDpsDto.serviceId && updateDpsDto.serviceId !== dps.serviceId) {
            const service = await this.serviceRepository.findOne({ where: { id: updateDpsDto.serviceId } });
            if (!service) {
                throw new NotFoundException(`Service with ID "${updateDpsDto.serviceId}" not found.`);
            }
            dps.service = service;
            dps.serviceId = updateDpsDto.serviceId;
        }

        if (updateDpsDto.customPrice !== undefined) {
            dps.customPrice = updateDpsDto.customPrice;
        }
        if (updateDpsDto.quantity !== undefined) {
            dps.quantity = updateDpsDto.quantity;
        }
        if (updateDpsDto.notes !== undefined) {
            dps.notes = updateDpsDto.notes;
        }

        return this.dpsRepository.save(dps);
    }

    async remove(id: string): Promise<void> {
        const result = await this.dpsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Development Plan Service with ID "${id}" not found.`);
        }
    }
}