import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { BlogPost } from '../../blog-posts/entities/blog-post.entity';
import { CaseStudy } from '../../case-studies/entities/case-study.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', length: 100 })
    name: string;

    @Column({ name: 'slug', unique: true, length: 100 })
    slug: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => BlogPost, (blogPost) => blogPost.category)
    blogPosts: BlogPost[];

    @OneToMany(() => CaseStudy, (caseStudy) => caseStudy.category)
    caseStudies: CaseStudy[];
}
