import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { BlogPost } from './entities/blog-post.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(BlogPost)
        private readonly blogPostRepository: Repository<BlogPost>,
    ) { }

    async create(createCommentDto: CreateCommentDto, blogPostId: string, authorId: string): Promise<Comment> {
        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        const blogPost = await this.blogPostRepository.findOne({ where: { id: blogPostId } });
        if (!blogPost) {
            throw new NotFoundException(`Blog Post with ID "${blogPostId}" not found.`);
        }

        const newComment = this.commentRepository.create({
            ...createCommentDto,
            author,
            blogPost,
        });

        return this.commentRepository.save(newComment);
    }

    async findAll(blogPostId: string): Promise<Comment[]> {
        const blogPost = await this.blogPostRepository.findOne({ where: { id: blogPostId } });
        if (!blogPost) {
            throw new NotFoundException(`Blog Post with ID "${blogPostId}" not found.`);
        }

        return this.commentRepository.find({
            where: { blogPost: { id: blogPostId } },
            relations: ['author'],
        });
    }
}