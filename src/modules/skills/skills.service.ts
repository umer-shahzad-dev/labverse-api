import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
    constructor(
        @InjectRepository(Skill)
        private readonly skillsRepository: Repository<Skill>,
    ) { }

    async create(createSkillDto: CreateSkillDto): Promise<Skill> {
        const skill = this.skillsRepository.create(createSkillDto);
        return this.skillsRepository.save(skill);
    }

    async findAll(): Promise<Skill[]> {
        return this.skillsRepository.find();
    }

    async findOne(id: string): Promise<Skill> {
        const skill = await this.skillsRepository.findOne({ where: { id } });
        if (!skill) {
            throw new NotFoundException(`Skill with ID "${id}" not found.`);
        }
        return skill;
    }

    async update(id: string, updateSkillDto: UpdateSkillDto): Promise<Skill> {
        const skill = await this.findOne(id);
        Object.assign(skill, updateSkillDto);
        return this.skillsRepository.save(skill);
    }

    async remove(id: string): Promise<void> {
        const result = await this.skillsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Skill with ID "${id}" not found.`);
        }
    }
}