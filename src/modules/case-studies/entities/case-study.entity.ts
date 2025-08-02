import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('case_studies')
export class CaseStudy {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'title' })
    title: string;

    @Column('text', { name: 'summary' })
    summary: string;

    @Column('text', { name: 'content' })
    content: string;

    @ManyToOne(() => User, (user) => user.caseStudies, { onDelete: 'SET NULL' })
    author: User;

    @Column({ name: 'author_id', type: 'uuid', nullable: true })
    authorId: string;

    @ManyToOne(() => Category, (category) => category.caseStudies, { onDelete: 'SET NULL' })
    category: Category;

    @Column({ name: 'category_id', type: 'uuid', nullable: true })
    categoryId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
