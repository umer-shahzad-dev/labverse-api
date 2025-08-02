import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { InteractionType } from '../enums/interaction-type.enum';

@Entity('client_interactions')
export class ClientInteraction {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: InteractionType,
        default: InteractionType.EMAIL,
    })
    type: InteractionType;

    @Column('text', { name: 'description' })
    description: string;

    @Column('date', { name: 'interaction_date' })
    interactionDate: Date;

    @ManyToOne(() => User, (user) => user.loggedInteractions)
    loggedBy: User;

    @Column({ name: 'logged_by_id', type: 'uuid' })
    loggedById: string;

    @ManyToOne(() => User, (user) => user.clientInteractions, { nullable: true })
    interactedWith: User;

    @Column({ name: 'interacted_with_id', type: 'uuid', nullable: true })
    interactedWithId: string;

    @ManyToOne(() => Lead, (lead) => lead.interactions, { nullable: true })
    @JoinColumn({ name: 'lead_id' }) 
    interactedWithLead: Lead;

    @Column({ name: 'lead_id', type: 'uuid', nullable: true })
    leadId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
