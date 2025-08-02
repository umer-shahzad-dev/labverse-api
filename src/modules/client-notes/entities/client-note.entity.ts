import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity('client_notes')
export class ClientNote {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('text', { name: 'content' })
    content: string;

    @ManyToOne(() => User, (user) => user.authoredNotes, { onDelete: 'CASCADE' })
    author: User;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @ManyToOne(() => User, (user) => user.clientNotes, { nullable: true, onDelete: 'CASCADE' })
    client: User;

    @Column({ name: 'client_id', type: 'uuid', nullable: true })
    clientId: string;

    @ManyToOne(() => Lead, (lead) => lead.notes, { nullable: true, onDelete: 'CASCADE' })
    lead: Lead;

    @Column({ name: 'lead_id', type: 'uuid', nullable: true })
    leadId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
