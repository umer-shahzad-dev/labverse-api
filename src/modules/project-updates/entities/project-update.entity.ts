import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity'; // User who made the update

@Entity({ name: 'project_updates' })
export class ProjectUpdate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string; // Foreign key to Project

    @Column({ name: 'user_id', nullable: true }) // User who made the update (optional)
    userId: string;

    @ManyToOne(() => Project, (project) => project.updates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, (user) => user.projectUpdates, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User; // The user who created this update

    @Column()
    description: string; // The content of the update

    @Column({ type: 'date', name: 'update_date', default: () => 'CURRENT_DATE' })
    updateDate: Date; // The date the update was made

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}