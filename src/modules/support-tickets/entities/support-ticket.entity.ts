// src/modules/support-tickets/entities/support-ticket.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TicketStatus } from '../enums/ticket-status.enum';
import { TicketPriority } from '../enums/ticket-priority.enum';
import { TicketComment } from './ticket-comment.entity';

@Entity('support_tickets')
export class SupportTicket {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description' })
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
        name: 'status',
    })
    status: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
        name: 'priority',
    })
    priority: TicketPriority;

    // Reporter (User who reported the ticket)
    @ManyToOne(() => User, user => user.reportedTickets)
    reporter: User;

    @Column({ type: 'uuid', name: 'reporter_id' })
    reporterId: string;

    // Assigned user (optional)
    @ManyToOne(() => User, user => user.assignedTickets, { nullable: true })
    assignedTo: User;

    @Column({ type: 'uuid', nullable: true, name: 'assigned_to_id' })
    assignedToId: string;

    // Ticket comments
    @OneToMany(() => TicketComment, comment => comment.ticket)
    comments: TicketComment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
