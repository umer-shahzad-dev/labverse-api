import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BlogPost } from './blog-post.entity';

@Entity('blog_post_comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'content', type: 'text' })
    content: string;

    @ManyToOne(() => User, (user) => user.comments)
    author: User;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId: string;

    @ManyToOne(() => BlogPost, (blogPost) => blogPost.comments)
    blogPost: BlogPost;

    @Column({ name: 'blog_post_id', type: 'uuid' })
    blogPostId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
