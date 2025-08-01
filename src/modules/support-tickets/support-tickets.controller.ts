// src/modules/support-tickets/support-tickets.controller.ts

import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { UpdateSupportTicketDto } from './dto/update-support-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator'; // <-- Adjusted import
import { TicketStatus } from './enums/ticket-status.enum';
import { RoleEnum } from '../roles/role.enum'; // <-- Use YOUR RoleEnum

@UseGuards(JwtAuthGuard)
@Controller('support-tickets')
export class SupportTicketsController {
    constructor(private readonly supportTicketsService: SupportTicketsService) { }

    // ==================== TICKET MANAGEMENT ====================

    @Post()
    async createTicket(@GetUser() user: User, @Body() createTicketDto: CreateSupportTicketDto) {
        return this.supportTicketsService.createTicket(user.id, createTicketDto);
    }

    @Get()
    @Permissions('manage_support_tickets')
    @UseGuards(PermissionsGuard)
    async findAllTickets(@Query('status') status?: TicketStatus) {
        return this.supportTicketsService.findAllTickets(status);
    }

    @Get('my')
    async findMyTickets(@GetUser() user: User) {
        return this.supportTicketsService.findMyTickets(user.id);
    }

    @Get(':id')
    async findOneTicket(@Param('id') id: string, @GetUser() user: User) {
        return this.supportTicketsService.findOneTicket(id, user.id, user.role.name as RoleEnum);
    }

    @Patch(':id')
    @Permissions('manage_support_tickets')
    @UseGuards(PermissionsGuard)
    async updateTicket(@Param('id') id: string, @Body() updateTicketDto: UpdateSupportTicketDto, @GetUser() user: User) {
        return this.supportTicketsService.updateTicket(id, updateTicketDto, user.role.name as RoleEnum);
    }

    // ==================== COMMENT MANAGEMENT ====================

    @Post(':id/comments')
    async addComment(@Param('id') ticketId: string, @GetUser() user: User, @Body() createCommentDto: CreateTicketCommentDto) {
        return this.supportTicketsService.addComment(ticketId, user.id, createCommentDto);
    }

    @Get(':id/comments')
    async findTicketComments(@Param('id') id: string) {
        return this.supportTicketsService.findTicketComments(id);
    }
}