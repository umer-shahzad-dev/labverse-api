import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostsService } from './blog-posts.service';
import { CommentsService } from './comments.service';
import { BlogPostsController } from './blog-posts.controller';
import { CommentsController } from './comments.controller';
import { BlogPost } from './entities/blog-post.entity';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BlogPost, Comment, User, Category])],
    providers: [BlogPostsService, CommentsService],
    controllers: [BlogPostsController, CommentsController], 
})
export class BlogPostsModule { }