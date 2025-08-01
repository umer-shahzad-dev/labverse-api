import { Module } from '@nestjs/common';
import { SupportTicketsService } from './support-tickets.service';
import { SupportTicketsController } from './support-tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicket } from './entities/support-ticket.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { User } from '../users/entities/user.entity'; // <-- Import the User entity

@Module({
    imports: [
        TypeOrmModule.forFeature([SupportTicket, TicketComment, User]), // <-- Add the User entity here
    ],
    controllers: [SupportTicketsController],
    providers: [SupportTicketsService],
})
export class SupportTicketsModule { }