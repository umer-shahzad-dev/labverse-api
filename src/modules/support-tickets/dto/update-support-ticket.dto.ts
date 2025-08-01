// src/modules/support-tickets/dto/update-support-ticket.dto.ts

import { IsString, IsEnum, IsOptional, IsUUID, MaxLength } from 'class-validator';
import { TicketStatus } from '../enums/ticket-status.enum';
import { TicketPriority } from '../enums/ticket-priority.enum';

export class UpdateSupportTicketDto {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TicketStatus)
    @IsOptional()
    status?: TicketStatus;

    @IsEnum(TicketPriority)
    @IsOptional()
    priority?: TicketPriority;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;
}