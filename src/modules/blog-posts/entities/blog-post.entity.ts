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
import { Category } from '../../categories/entities/category.entity';
import { Comment } from './comment.entity';

@Entity('blog_posts')
export class BlogPost {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'title', length: 255 })
    title: string;

    @Column({ name: 'slug', unique: true, length: 255 })
    slug: string;

    @Column({ name: 'content', type: 'text' })
    content: string;

    @ManyToOne(() => User, (user) => user.blogPosts)
    author: User;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @ManyToOne(() => Category, (category) => category.blogPosts)
    category: Category;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    @OneToMany(() => Comment, (comment) => comment.blogPost)
    comments: Comment[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
