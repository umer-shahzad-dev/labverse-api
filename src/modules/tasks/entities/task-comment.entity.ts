import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '../../users/entities/user.entity'; // For comment author

@Entity('task_comments')
export class TaskComment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    comment: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Explicitly name
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Explicitly name
    updatedAt: Date;

    // --- Relationships ---

    // Many-to-One: TaskComment to Task
    @ManyToOne(() => Task, (task) => task.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' }) // Explicitly name foreign key column
    task: Task;

    @Column({ name: 'task_id', type: 'uuid' }) // Explicitly define foreign key column
    taskId: string;

    // Many-to-One: TaskComment to User (Author)
    @ManyToOne(() => User, (user) => user.taskComments, { onDelete: 'SET NULL', nullable: true }) // If user deleted, comment creator becomes null
    @JoinColumn({ name: 'author_id' }) // Explicitly name foreign key column
    author: User;

    @Column({ name: 'author_id', type: 'uuid', nullable: true }) // Explicitly define foreign key column
    authorId: string;
}