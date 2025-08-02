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
import { Answer } from '../../answers/entities/answer.entity';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'title' })
    title: string;

    @Column('text', { name: 'content' })
    content: string;

    @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
    author: User;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
