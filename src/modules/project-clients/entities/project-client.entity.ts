import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'project_clients' })
@Unique(['projectId', 'userId']) // Ensures a user can only be assigned as a client to a specific project once
export class ProjectClient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string; // Foreign key to Project

    @Column({ name: 'user_id' })
    userId: string; // Foreign key to User (the client user)

    @ManyToOne(() => Project, (project) => project.clients, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, (user) => user.clientProjects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User; // The User who is acting as the client for this project

    @Column({ type: 'date', name: 'assigned_at', default: () => 'CURRENT_DATE' })
    assignedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}