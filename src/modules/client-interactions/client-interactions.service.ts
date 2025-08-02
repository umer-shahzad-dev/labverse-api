import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientInteraction } from './entities/client-interaction.entity';
import { CreateClientInteractionDto } from './dto/create-client-interaction.dto';
import { UpdateClientInteractionDto } from './dto/update-client-interaction.dto';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class ClientInteractionsService {
    constructor(
        @InjectRepository(ClientInteraction)
        private readonly clientInteractionRepository: Repository<ClientInteraction>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Lead)
        private readonly leadRepository: Repository<Lead>,
    ) { }

    async create(createClientInteractionDto: CreateClientInteractionDto, loggedById: string): Promise<ClientInteraction> {
        const { interactedWithId, interactedWithLeadId, ...data } = createClientInteractionDto;

        if (!interactedWithId && !interactedWithLeadId) {
            throw new BadRequestException('A client interaction must be linked to either a client or a lead.');
        }
        if (interactedWithId && interactedWithLeadId) {
            throw new BadRequestException('A client interaction cannot be linked to both a client and a lead.');
        }

        const loggedBy = await this.userRepository.findOne({ where: { id: loggedById } });
        if (!loggedBy) {
            throw new NotFoundException(`User with ID "${loggedById}" not found.`);
        }

        let interactedWith: User | null = null;
        let interactedWithLead: Lead | null = null;

        if (interactedWithId) {
            interactedWith = await this.userRepository.findOne({ where: { id: interactedWithId } });
            if (!interactedWith) {
                throw new NotFoundException(`Client with ID "${interactedWithId}" not found.`);
            }
        } else if (interactedWithLeadId) {
            interactedWithLead = await this.leadRepository.findOne({ where: { id: interactedWithLeadId } });
            if (!interactedWithLead) {
                throw new NotFoundException(`Lead with ID "${interactedWithLeadId}" not found.`);
            }
        }

        const newInteraction = this.clientInteractionRepository.create({
            ...data,
            loggedBy,
            interactedWith,
            interactedWithLead,
        });

        return this.clientInteractionRepository.save(newInteraction);
    }

    async findAll(): Promise<ClientInteraction[]> {
        return this.clientInteractionRepository.find({ relations: ['loggedBy', 'interactedWith', 'interactedWithLead'] });
    }

    async findOne(id: string): Promise<ClientInteraction> {
        const interaction = await this.clientInteractionRepository.findOne({
            where: { id },
            relations: ['loggedBy', 'interactedWith', 'interactedWithLead'],
        });
        if (!interaction) {
            throw new NotFoundException(`Client Interaction with ID "${id}" not found.`);
        }
        return interaction;
    }

    async update(id: string, updateClientInteractionDto: UpdateClientInteractionDto, currentUserId: string): Promise<ClientInteraction> {
        const interaction = await this.clientInteractionRepository.findOne({
            where: { id },
            relations: ['loggedBy'],
        });
        if (!interaction) {
            throw new NotFoundException(`Client Interaction with ID "${id}" not found.`);
        }

        // Authorization check: only the user who logged the interaction can update it
        if (interaction.loggedBy.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this interaction.');
        }

        this.clientInteractionRepository.merge(interaction, updateClientInteractionDto);
        return this.clientInteractionRepository.save(interaction);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const interaction = await this.clientInteractionRepository.findOne({
            where: { id },
            relations: ['loggedBy'],
        });
        if (!interaction) {
            throw new NotFoundException(`Client Interaction with ID "${id}" not found.`);
        }

        // Authorization check: only the user who logged the interaction can delete it
        if (interaction.loggedBy.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this interaction.');
        }

        await this.clientInteractionRepository.remove(interaction);
    }
}