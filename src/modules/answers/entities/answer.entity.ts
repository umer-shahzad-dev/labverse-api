import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity('answers')
export class Answer {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('text', { name: 'content' })
    content: string;

    @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
    question: Question;

    @Column({ name: 'question_id', type: 'uuid' })
    questionId: string;

    @ManyToOne(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
    author: User;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
