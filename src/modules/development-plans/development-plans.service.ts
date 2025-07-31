import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlan } from './entities/development-plan.entity';
import { CreateDevelopmentPlanDto } from './dto/create-development-plan.dto';
import { UpdateDevelopmentPlanDto } from './dto/update-development-plan.dto';

@Injectable()
export class DevelopmentPlansService {
    constructor(
        @InjectRepository(DevelopmentPlan)
        private developmentPlansRepository: Repository<DevelopmentPlan>,
    ) { }

    async create(createDevelopmentPlanDto: CreateDevelopmentPlanDto): Promise<DevelopmentPlan> {
        const existingPlan = await this.developmentPlansRepository.findOne({
            where: { name: createDevelopmentPlanDto.name },
        });
        if (existingPlan) {
            throw new ConflictException(`Development Plan with name "${createDevelopmentPlanDto.name}" already exists.`);
        }

        const plan = this.developmentPlansRepository.create(createDevelopmentPlanDto);
        return this.developmentPlansRepository.save(plan);
    }

    async findAll(): Promise<DevelopmentPlan[]> {
        return this.developmentPlansRepository.find({
            relations: ['planFeatures.planFeature', 'planServices.service', 'planTechnologies.technology'],
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<DevelopmentPlan> {
        const plan = await this.developmentPlansRepository.findOne({
            where: { id },
            relations: ['planFeatures.planFeature', 'planServices.service', 'planTechnologies.technology'],
        });
        if (!plan) {
            throw new NotFoundException(`Development Plan with ID "${id}" not found.`);
        }
        return plan;
    }

    async update(id: string, updateDevelopmentPlanDto: UpdateDevelopmentPlanDto): Promise<DevelopmentPlan> {
        const plan = await this.developmentPlansRepository.findOne({ where: { id } });
        if (!plan) {
            throw new NotFoundException(`Development Plan with ID "${id}" not found.`);
        }

        if (updateDevelopmentPlanDto.name && updateDevelopmentPlanDto.name !== plan.name) {
            const existingPlan = await this.developmentPlansRepository.findOne({
                where: { name: updateDevelopmentPlanDto.name },
            });
            if (existingPlan && existingPlan.id !== id) {
                throw new ConflictException(`Development Plan with name "${updateDevelopmentPlanDto.name}" already exists.`);
            }
        }

        Object.assign(plan, updateDevelopmentPlanDto);
        return this.developmentPlansRepository.save(plan);
    }

    async remove(id: string): Promise<void> {
        const result = await this.developmentPlansRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Development Plan with ID "${id}" not found.`);
        }
    }
}