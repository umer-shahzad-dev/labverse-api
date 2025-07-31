import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { ProjectMilestone } from '../../project-milestones/entities/project-milestone.entity';
import { User } from '../../users/entities/user.entity'; // For assignedTo and createdBy users
import { TaskComment } from './task-comment.entity'; // For comments on this task
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';

export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    CODE_REVIEW = 'code_review',
    QA = 'qa',
    BLOCKED = 'blocked',
    DONE = 'done',
    ARCHIVED = 'archived',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.TODO,
    })
    status: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        default: TaskPriority.MEDIUM,
    })
    priority: TaskPriority;

    @Column({ name: 'due_date', type: 'date', nullable: true }) // Explicitly name for snake_case
    dueDate: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Explicitly name
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Explicitly name
    updatedAt: Date;

    // --- Relationships ---

    // Many-to-One: Task to Project
    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' }) // Explicitly name foreign key column
    project: Project;

    @Column({ name: 'project_id', type: 'uuid' }) // Explicitly define foreign key column
    projectId: string;

    // Many-to-One: Task to ProjectMilestone (Optional)
    @ManyToOne(() => ProjectMilestone, (milestone) => milestone.tasks, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'milestone_id' }) // Explicitly name foreign key column
    milestone: ProjectMilestone;

    @Column({ name: 'milestone_id', type: 'uuid', nullable: true }) // Explicitly define foreign key column
    milestoneId: string;

    // Many-to-One: Task to User (Assigned To)
    @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigned_to_user_id' }) // Explicitly name foreign key column
    assignedTo: User;

    @Column({ name: 'assigned_to_user_id', type: 'uuid', nullable: true }) // Explicitly define foreign key column
    assignedToUserId: string;

    // Many-to-One: Task to User (Created By)
    @ManyToOne(() => User, (user) => user.createdTasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by_user_id' }) // Explicitly name foreign key column
    createdBy: User;

    @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true }) // Explicitly define foreign key column
    createdByUserId: string;

    // One-to-Many: Task to TaskComments
    @OneToMany(() => TaskComment, (comment) => comment.task)
    comments: TaskComment[];

    @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.task) // <--- NEW
    timeEntries: TimeEntry[];

}