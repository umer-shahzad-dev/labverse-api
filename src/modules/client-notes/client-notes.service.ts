import {
    Injectable,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientNote } from './entities/client-note.entity';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class ClientNotesService {
    constructor(
        @InjectRepository(ClientNote)
        private readonly clientNoteRepository: Repository<ClientNote>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Lead)
        private readonly leadRepository: Repository<Lead>,
    ) { }

    async create(createClientNoteDto: CreateClientNoteDto, authorId: string): Promise<ClientNote> {
        const { clientId, leadId, ...data } = createClientNoteDto;

        if (!clientId && !leadId) {
            throw new BadRequestException('A client note must be linked to either a client or a lead.');
        }
        if (clientId && leadId) {
            throw new BadRequestException('A client note cannot be linked to both a client and a lead.');
        }

        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        let client: User | null = null;
        let lead: Lead | null = null;

        if (clientId) {
            client = await this.userRepository.findOne({ where: { id: clientId } });
            if (!client) {
                throw new NotFoundException(`Client with ID "${clientId}" not found.`);
            }
        } else if (leadId) {
            lead = await this.leadRepository.findOne({ where: { id: leadId } });
            if (!lead) {
                throw new NotFoundException(`Lead with ID "${leadId}" not found.`);
            }
        }

        const newNote = this.clientNoteRepository.create({
            ...data,
            author,
            client,
            lead,
        });

        return this.clientNoteRepository.save(newNote);
    }

    async findAll(): Promise<ClientNote[]> {
        return this.clientNoteRepository.find({ relations: ['author', 'client', 'lead'] });
    }

    async findOne(id: string): Promise<ClientNote> {
        const note = await this.clientNoteRepository.findOne({
            where: { id },
            relations: ['author', 'client', 'lead'],
        });
        if (!note) {
            throw new NotFoundException(`Client Note with ID "${id}" not found.`);
        }
        return note;
    }

    async update(id: string, updateClientNoteDto: UpdateClientNoteDto, currentUserId: string): Promise<ClientNote> {
        const note = await this.clientNoteRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!note) {
            throw new NotFoundException(`Client Note with ID "${id}" not found.`);
        }

        // Authorization check: only the author can update their note
        if (note.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this note.');
        }

        this.clientNoteRepository.merge(note, updateClientNoteDto);
        return this.clientNoteRepository.save(note);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const note = await this.clientNoteRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!note) {
            throw new NotFoundException(`Client Note with ID "${id}" not found.`);
        }

        // Authorization check: only the author can delete their note
        if (note.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this note.');
        }

        await this.clientNoteRepository.remove(note);
    }
}