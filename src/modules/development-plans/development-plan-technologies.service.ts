import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DevelopmentPlanTechnology } from './entities/development-plan-technology.entity';
import { CreateDevelopmentPlanTechnologyDto } from './dto/create-development-plan-technology.dto';
import { UpdateDevelopmentPlanTechnologyDto } from './dto/update-development-plan-technology.dto';
import { DevelopmentPlan } from './entities/development-plan.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Injectable()
export class DevelopmentPlanTechnologiesService {
    constructor(
        @InjectRepository(DevelopmentPlanTechnology)
        private dptRepository: Repository<DevelopmentPlanTechnology>,
        @InjectRepository(DevelopmentPlan)
        private developmentPlanRepository: Repository<DevelopmentPlan>,
        @InjectRepository(Technology)
        private technologyRepository: Repository<Technology>,
    ) { }

    async create(createDptDto: CreateDevelopmentPlanTechnologyDto): Promise<DevelopmentPlanTechnology> {
        const { developmentPlanId, technologyId, notes } = createDptDto;

        const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: developmentPlanId } });
        if (!developmentPlan) {
            throw new NotFoundException(`Development Plan with ID "${developmentPlanId}" not found.`);
        }

        const technology = await this.technologyRepository.findOne({ where: { id: technologyId } });
        if (!technology) {
            throw new NotFoundException(`Technology with ID "${technologyId}" not found.`);
        }

        const existingEntry = await this.dptRepository.findOne({
            where: { developmentPlanId, technologyId },
        });
        if (existingEntry) {
            throw new ConflictException(`Technology "${technology.name}" is already associated with Development Plan "${developmentPlan.name}".`);
        }

        const dpt = this.dptRepository.create({
            developmentPlan,
            technology,
            developmentPlanId,
            technologyId,
            notes,
        });

        return this.dptRepository.save(dpt);
    }

    async findAll(): Promise<DevelopmentPlanTechnology[]> {
        return this.dptRepository.find({
            relations: ['developmentPlan', 'technology'],
        });
    }

    async findOne(id: string): Promise<DevelopmentPlanTechnology> {
        const dpt = await this.dptRepository.findOne({
            where: { id },
            relations: ['developmentPlan', 'technology'],
        });
        if (!dpt) {
            throw new NotFoundException(`Development Plan Technology with ID "${id}" not found.`);
        }
        return dpt;
    }

    async update(id: string, updateDptDto: UpdateDevelopmentPlanTechnologyDto): Promise<DevelopmentPlanTechnology> {
        const dpt = await this.dptRepository.findOne({ where: { id } });
        if (!dpt) {
            throw new NotFoundException(`Development Plan Technology with ID "${id}" not found.`);
        }

        if (updateDptDto.developmentPlanId || updateDptDto.technologyId) {
            const newDevelopmentPlanId = updateDptDto.developmentPlanId || dpt.developmentPlanId;
            const newTechnologyId = updateDptDto.technologyId || dpt.technologyId;

            if (newDevelopmentPlanId !== dpt.developmentPlanId || newTechnologyId !== dpt.technologyId) {
                const existingEntry = await this.dptRepository.findOne({
                    where: { developmentPlanId: newDevelopmentPlanId, technologyId: newTechnologyId },
                });
                if (existingEntry && existingEntry.id !== id) {
                    throw new ConflictException(`This Development Plan Technology association already exists.`);
                }
            }
        }

        if (updateDptDto.developmentPlanId && updateDptDto.developmentPlanId !== dpt.developmentPlanId) {
            const developmentPlan = await this.developmentPlanRepository.findOne({ where: { id: updateDptDto.developmentPlanId } });
            if (!developmentPlan) {
                throw new NotFoundException(`Development Plan with ID "${updateDptDto.developmentPlanId}" not found.`);
            }
            dpt.developmentPlan = developmentPlan;
            dpt.developmentPlanId = updateDptDto.developmentPlanId;
        }

        if (updateDptDto.technologyId && updateDptDto.technologyId !== dpt.technologyId) {
            const technology = await this.technologyRepository.findOne({ where: { id: updateDptDto.technologyId } });
            if (!technology) {
                throw new NotFoundException(`Technology with ID "${updateDptDto.technologyId}" not found.`);
            }
            dpt.technology = technology;
            dpt.technologyId = updateDptDto.technologyId;
        }

        if (updateDptDto.notes !== undefined) {
            dpt.notes = updateDptDto.notes;
        }

        return this.dptRepository.save(dpt);
    }

    async remove(id: string): Promise<void> {
        const result = await this.dptRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Development Plan Technology with ID "${id}" not found.`);
        }
    }
}