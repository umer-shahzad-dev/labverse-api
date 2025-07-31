import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanFeature } from './entities/development-plan-feature.entity';
import { CreateDevelopmentPlanFeatureDto } from './dto/create-development-plan-feature.dto';
import { UpdateDevelopmentPlanFeatureDto } from './dto/update-development-plan-feature.dto';
import { DevelopmentPlan } from './entities/development-plan.entity';
import { PlanFeature } from '../plan-features/entities/plan-feature.entity';

@Injectable()
export class DevelopmentPlanFeaturesService {
    constructor(
        @InjectRepository(DevelopmentPlanFeature)
        private dpfRepository: Repository<DevelopmentPlanFeature>,
        @InjectRepository(DevelopmentPlan)
        private developmentPlanRepository: Repository<DevelopmentPlan>,
        @InjectRepository(PlanFeature)
        private planFeatureRepository: Repository<PlanFeature>,
    ) { }

    async create(createDpfDto: CreateDevelopmentPlanFeatureDto): Promise<DevelopmentPlanFeature> {
        const { developmentPlanId, planFeatureId, priceAdjustment, notes } = createDpfDto;

        const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: developmentPlanId } });
        if (!developmentPlan) {
            throw new NotFoundException(`Development Plan with ID "${developmentPlanId}" not found.`);
        }

        const planFeature = await this.planFeatureRepository.findOne({ where: { id: planFeatureId } });
        if (!planFeature) {
            throw new NotFoundException(`Plan Feature with ID "${planFeatureId}" not found.`);
        }

        const existingEntry = await this.dpfRepository.findOne({
            where: { developmentPlanId, planFeatureId },
        });
        if (existingEntry) {
            throw new ConflictException(`Plan Feature "${planFeature.name}" is already associated with Development Plan "${developmentPlan.name}".`);
        }

        const dpf = this.dpfRepository.create({
            developmentPlan,
            planFeature,
            developmentPlanId,
            planFeatureId,
            priceAdjustment: priceAdjustment !== undefined ? priceAdjustment : planFeature.defaultPriceAdjustment,
            notes,
        });

        return this.dpfRepository.save(dpf);
    }

    async findAll(): Promise<DevelopmentPlanFeature[]> {
        return this.dpfRepository.find({
            relations: ['developmentPlan', 'planFeature'],
        });
    }

    async findOne(id: string): Promise<DevelopmentPlanFeature> {
        const dpf = await this.dpfRepository.findOne({
            where: { id },
            relations: ['developmentPlan', 'planFeature'],
        });
        if (!dpf) {
            throw new NotFoundException(`Development Plan Feature with ID "${id}" not found.`);
        }
        return dpf;
    }

    async update(id: string, updateDpfDto: UpdateDevelopmentPlanFeatureDto): Promise<DevelopmentPlanFeature> {
        const dpf = await this.dpfRepository.findOne({ where: { id } });
        if (!dpf) {
            throw new NotFoundException(`Development Plan Feature with ID "${id}" not found.`);
        }

        // Handle potential unique constraint violation if both IDs are updated
        if (updateDpfDto.developmentPlanId || updateDpfDto.planFeatureId) {
            const newDevelopmentPlanId = updateDpfDto.developmentPlanId || dpf.developmentPlanId;
            const newPlanFeatureId = updateDpfDto.planFeatureId || dpf.planFeatureId;

            if (newDevelopmentPlanId !== dpf.developmentPlanId || newPlanFeatureId !== dpf.planFeatureId) {
                const existingEntry = await this.dpfRepository.findOne({
                    where: { developmentPlanId: newDevelopmentPlanId, planFeatureId: newPlanFeatureId },
                });
                if (existingEntry && existingEntry.id !== id) {
                    throw new ConflictException(`This Development Plan Feature association already exists.`);
                }
            }
        }

        // Update foreign key relationships if IDs are provided
        if (updateDpfDto.developmentPlanId && updateDpfDto.developmentPlanId !== dpf.developmentPlanId) {
            const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: updateDpfDto.developmentPlanId } });
            if (!developmentPlan) {
                throw new NotFoundException(`Development Plan with ID "${updateDpfDto.developmentPlanId}" not found.`);
            }
            dpf.developmentPlan = developmentPlan;
            dpf.developmentPlanId = updateDpfDto.developmentPlanId;
        }

        if (updateDpfDto.planFeatureId && updateDpfDto.planFeatureId !== dpf.planFeatureId) {
            const planFeature = await this.planFeatureRepository.findOne({ where: { id: updateDpfDto.planFeatureId } });
            if (!planFeature) {
                throw new NotFoundException(`Plan Feature with ID "${updateDpfDto.planFeatureId}" not found.`);
            }
            dpf.planFeature = planFeature;
            dpf.planFeatureId = updateDpfDto.planFeatureId;
        }

        // Apply other updates
        if (updateDpfDto.priceAdjustment !== undefined) {
            dpf.priceAdjustment = updateDpfDto.priceAdjustment;
        }
        if (updateDpfDto.notes !== undefined) {
            dpf.notes = updateDpfDto.notes;
        }

        return this.dpfRepository.save(dpf);
    }

    async remove(id: string): Promise<void> {
        const result = await this.dpfRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Development Plan Feature with ID "${id}" not found.`);
        }
    }
}