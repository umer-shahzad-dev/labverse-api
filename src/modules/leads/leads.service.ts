import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(Lead)
        private readonly leadRepository: Repository<Lead>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createLeadDto: CreateLeadDto): Promise<Lead> {
        const { assignedToId, ...data } = createLeadDto;

        let assignedTo: User | null = null;
        if (assignedToId) {
            assignedTo = await this.userRepository.findOne({ where: { id: assignedToId } });
            if (!assignedTo) {
                throw new NotFoundException(`User with ID "${assignedToId}" not found.`);
            }
        }

        const newLead = this.leadRepository.create({
            ...data,
            assignedTo,
        });
        return this.leadRepository.save(newLead);
    }

    async findAll(): Promise<Lead[]> {
        return this.leadRepository.find({ relations: ['assignedTo'] });
    }

    async findOne(id: string): Promise<Lead> {
        const lead = await this.leadRepository.findOne({
            where: { id },
            relations: ['assignedTo'],
        });
        if (!lead) {
            throw new NotFoundException(`Lead with ID "${id}" not found.`);
        }
        return lead;
    }

    async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
        const lead = await this.findOne(id);
        const { assignedToId, ...data } = updateLeadDto;

        // Handle assignedTo update
        if (assignedToId !== undefined) {
            const assignedToUser = await this.userRepository.findOne({ where: { id: assignedToId } });
            if (!assignedToUser) {
                throw new NotFoundException(`User with ID "${assignedToId}" not found.`);
            }
            lead.assignedTo = assignedToUser;
        }

        this.leadRepository.merge(lead, data);
        return this.leadRepository.save(lead);
    }

    async remove(id: string): Promise<void> {
        const lead = await this.findOne(id);
        await this.leadRepository.remove(lead);
    }
}