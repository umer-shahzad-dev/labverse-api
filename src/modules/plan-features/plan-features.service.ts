import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanFeature } from './entities/plan-feature.entity';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';

@Injectable()
export class PlanFeaturesService {
    constructor(
        @InjectRepository(PlanFeature)
        private planFeaturesRepository: Repository<PlanFeature>,
    ) { }

    async create(createPlanFeatureDto: CreatePlanFeatureDto): Promise<PlanFeature> {
        const existingFeature = await this.planFeaturesRepository.findOne({
            where: { name: createPlanFeatureDto.name },
        });
        if (existingFeature) {
            throw new ConflictException(`Plan Feature with name "${createPlanFeatureDto.name}" already exists.`);
        }

        const feature = this.planFeaturesRepository.create(createPlanFeatureDto);
        return this.planFeaturesRepository.save(feature);
    }

    async findAll(): Promise<PlanFeature[]> {
        return this.planFeaturesRepository.find();
    }

    async findOne(id: string): Promise<PlanFeature> {
        const feature = await this.planFeaturesRepository.findOne({ where: { id } });
        if (!feature) {
            throw new NotFoundException(`Plan Feature with ID "${id}" not found.`);
        }
        return feature;
    }

    async update(id: string, updatePlanFeatureDto: UpdatePlanFeatureDto): Promise<PlanFeature> {
        const feature = await this.planFeaturesRepository.findOne({ where: { id } });
        if (!feature) {
            throw new NotFoundException(`Plan Feature with ID "${id}" not found.`);
        }

        if (updatePlanFeatureDto.name && updatePlanFeatureDto.name !== feature.name) {
            const existingFeature = await this.planFeaturesRepository.findOne({
                where: { name: updatePlanFeatureDto.name },
            });
            if (existingFeature && existingFeature.id !== id) {
                throw new ConflictException(`Plan Feature with name "${updatePlanFeatureDto.name}" already exists.`);
            }
        }

        Object.assign(feature, updatePlanFeatureDto);
        return this.planFeaturesRepository.save(feature);
    }

    async remove(id: string): Promise<void> {
        const result = await this.planFeaturesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Plan Feature with ID "${id}" not found.`);
        }
    }
}