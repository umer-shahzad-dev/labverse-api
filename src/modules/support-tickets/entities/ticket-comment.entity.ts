// src/modules/support-tickets/entities/ticket-comment.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SupportTicket } from './support-ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_comments')
export class TicketComment {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'content' })
    content: string;

    // Many-to-one relationship with the SupportTicket
    @ManyToOne(() => SupportTicket, ticket => ticket.comments)
    ticket: SupportTicket;

    @Column({ type: 'uuid', name: 'ticket_id' })
    ticketId: string;

    // Many-to-one relationship with the User who authored the comment
    @ManyToOne(() => User, user => user.ticketComments)
    author: User;

    @Column({ type: 'uuid', name: 'author_id' })
    authorId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
