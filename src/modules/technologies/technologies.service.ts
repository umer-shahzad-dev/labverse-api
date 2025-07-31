import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from './entities/technology.entity';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
    constructor(
        @InjectRepository(Technology)
        private readonly technologyRepository: Repository<Technology>,
    ) { }

    async create(createTechnologyDto: CreateTechnologyDto): Promise<Technology> {
        const existingTechnology = await this.technologyRepository.findOne({
            where: { name: createTechnologyDto.name },
        });
        if (existingTechnology) {
            throw new ConflictException(`Technology with name "${createTechnologyDto.name}" already exists.`);
        }

        const technology = this.technologyRepository.create(createTechnologyDto);
        return this.technologyRepository.save(technology);
    }

    async findAll(): Promise<Technology[]> {
        return this.technologyRepository.find();
    }

    async findOne(id: string): Promise<Technology> {
        const technology = await this.technologyRepository.findOne({ where: { id } });
        if (!technology) {
            throw new NotFoundException(`Technology with ID "${id}" not found.`);
        }
        return technology;
    }

    async update(id: string, updateTechnologyDto: UpdateTechnologyDto): Promise<Technology> {
        const technology = await this.findOne(id); // Ensures the technology exists

        if (updateTechnologyDto.name && updateTechnologyDto.name !== technology.name) {
            const existingTechnology = await this.technologyRepository.findOne({
                where: { name: updateTechnologyDto.name },
            });
            if (existingTechnology && existingTechnology.id !== id) {
                throw new ConflictException(`Technology with name "${updateTechnologyDto.name}" already exists.`);
            }
        }

        Object.assign(technology, updateTechnologyDto);
        return this.technologyRepository.save(technology);
    }

    async remove(id: string): Promise<void> {
        const result = await this.technologyRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Technology with ID "${id}" not found.`);
        }
    }
}