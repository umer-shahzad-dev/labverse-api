import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

export enum MilestoneStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
}

@Entity({ name: 'project_milestones' })
export class ProjectMilestone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string; // Foreign key to Project

    @ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'date', name: 'due_date', nullable: true })
    dueDate: Date;

    @Column({ type: 'date', name: 'completed_date', nullable: true })
    completedDate: Date; // Date when the milestone was actually completed

    @Column({ type: 'enum', enum: MilestoneStatus, default: MilestoneStatus.NOT_STARTED })
    status: MilestoneStatus;

    @OneToMany(() => Task, (task) => task.milestone)
    tasks: Task[]; // Now correctly typed

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}