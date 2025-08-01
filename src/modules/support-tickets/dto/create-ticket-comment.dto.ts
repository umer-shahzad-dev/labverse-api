// src/modules/support-tickets/dto/create-ticket-comment.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTicketCommentDto {
    @IsString()
    @IsNotEmpty()
    content: string;
}