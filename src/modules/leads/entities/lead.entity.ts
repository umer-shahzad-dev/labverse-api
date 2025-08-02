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
import { LeadStatus } from '../enums/lead-status.enum';
import { ClientNote } from '../../client-notes/entities/client-note.entity';
import { ClientInteraction } from '../../client-interactions/entities/client-interaction.entity';
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'email', unique: true, length: 255 })
  email: string;

  @Column({ name: 'phone', nullable: true, length: 20 })
  phone: string;

  @Column({ name: 'company', nullable: true, length: 255 })
  company: string;

  @Column({ name: 'source', nullable: true, length: 50 })
  source: string;

  @Column({ name: 'status', type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @ManyToOne(() => User, (user) => user.leads, { nullable: true })
  assignedTo: User;

  @Column({ name: 'assigned_to_id', type: 'uuid', nullable: true })
  assignedToId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ClientInteraction, (interaction) => interaction.interactedWithLead)
  interactions: ClientInteraction[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ClientNote, (note) => note.lead)
  notes: ClientNote[];
}
