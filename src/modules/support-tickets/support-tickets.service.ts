// src/modules/support-tickets/support-tickets.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { User } from '../users/entities/user.entity';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { TicketStatus } from './enums/ticket-status.enum';
import { RoleEnum } from '../roles/role.enum'; // <-- Use YOUR RoleEnum

@Injectable()
export class SupportTicketsService {
    constructor(
        @InjectRepository(SupportTicket)
        private ticketRepository: Repository<SupportTicket>,
        @InjectRepository(TicketComment)
        private commentRepository: Repository<TicketComment>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // ==================== TICKET MANAGEMENT ====================

    async createTicket(reporterId: string, createTicketDto: CreateSupportTicketDto): Promise<SupportTicket> {
        const reporter = await this.userRepository.findOne({ where: { id: reporterId } });
        if (!reporter) {
            throw new NotFoundException('Reporter not found.');
        }

        const newTicket = this.ticketRepository.create({
            ...createTicketDto,
            reporterId,
        });

        return this.ticketRepository.save(newTicket);
    }

    async findAllTickets(status?: TicketStatus): Promise<SupportTicket[]> {
        const findOptions = status ? { where: { status } } : {};
        return this.ticketRepository.find({
            ...findOptions,
            relations: ['reporter', 'assignedTo'],
            order: { createdAt: 'DESC' },
        });
    }

    async findMyTickets(reporterId: string): Promise<SupportTicket[]> {
        return this.ticketRepository.find({
            where: { reporterId },
            relations: ['reporter', 'assignedTo'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOneTicket(ticketId: string, userId: string, userRole: RoleEnum): Promise<SupportTicket> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId },
            relations: ['reporter', 'assignedTo', 'comments', 'comments.author'],
            order: { comments: { createdAt: 'ASC' } },
        });

        if (!ticket) {
            throw new NotFoundException(`Support ticket with ID "${ticketId}" not found.`);
        }

        // Check if user is the reporter or an admin
        if (ticket.reporterId !== userId && userRole !== RoleEnum.ADMIN) {
            throw new ForbiddenException('You are not authorized to view this ticket.');
        }

        return ticket;
    }

    async updateTicket(ticketId: string, updateTicketDto: UpdateSupportTicketDto, userRole: RoleEnum): Promise<SupportTicket> {
        // Only an admin can update a ticket
        if (userRole !== RoleEnum.ADMIN) {
            throw new ForbiddenException('You are not authorized to update this ticket.');
        }

        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) {
            throw new NotFoundException(`Support ticket with ID "${ticketId}" not found.`);
        }

        // If a new assignee is provided, verify they exist
        if (updateTicketDto.assignedToId) {
            const newAssignee = await this.userRepository.findOne({ where: { id: updateTicketDto.assignedToId } });
            if (!newAssignee) {
                throw new NotFoundException('Assigned user not found.');
            }
        }

        await this.ticketRepository.update(ticketId, updateTicketDto);

        return this.ticketRepository.findOne({ where: { id: ticketId } });
    }

    // ==================== COMMENT MANAGEMENT ====================

    async addComment(ticketId: string, authorId: string, createCommentDto: CreateTicketCommentDto): Promise<TicketComment> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) {
            throw new NotFoundException(`Support ticket with ID "${ticketId}" not found.`);
        }

        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException('Comment author not found.');
        }

        const newComment = this.commentRepository.create({
            ...createCommentDto,
            ticketId,
            authorId,
        });

        return this.commentRepository.save(newComment);
    }

    async findTicketComments(ticketId: string): Promise<TicketComment[]> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) {
            throw new NotFoundException(`Support ticket with ID "${ticketId}" not found.`);
        }

        return this.commentRepository.find({
            where: { ticketId },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });
    }
}