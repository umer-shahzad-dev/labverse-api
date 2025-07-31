import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('time_entries')
export class TimeEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'start_time', type: 'timestamp with time zone' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp with time zone' })
    endTime: Date;

    // Duration in minutes (or hours, based on preference, but minutes is more granular)
    @Column({ name: 'duration_minutes', type: 'numeric', precision: 10, scale: 2 })
    durationMinutes: number; // This will be calculated on save

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Relationships ---

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, (user) => user.timeEntries, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId: string;

    @ManyToOne(() => Project, (project) => project.timeEntries, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'task_id', type: 'uuid', nullable: true })
    taskId: string;

    @ManyToOne(() => Task, (task) => task.timeEntries, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'task_id' })
    task: Task;

}