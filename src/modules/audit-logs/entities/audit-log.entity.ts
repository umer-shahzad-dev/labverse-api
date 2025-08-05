import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn, // Import JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'action' })
    action: string; // e.g., 'user.login', 'project.create', 'user.delete'

    @Column({ name: 'entity_name' })
    entityName: string; // The name of the entity, e.g., 'User', 'Project'

    @Column({ name: 'entity_id', nullable: true })
    entityId: string; // The ID of the entity that was affected

    @Column('jsonb', { name: 'details', nullable: true })
    details: object; // A JSON object to store more information about the action

    // Explicitly tell TypeORM to create a 'user_id' foreign key column
    @ManyToOne(() => User, (user) => user.auditLogs, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User; // The user who performed the action

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
