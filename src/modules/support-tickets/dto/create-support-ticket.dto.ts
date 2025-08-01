// src/modules/support-tickets/dto/create-support-ticket.dto.ts

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSupportTicketDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}