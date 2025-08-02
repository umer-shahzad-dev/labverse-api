import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

// Extend Express Request interface to include 'user'
declare module 'express' {
    interface Request {
        user?: any;
    }
}

@Controller('blog-posts')
export class BlogPostsController {
    constructor(private readonly blogPostsService: BlogPostsService) { }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Post()
    @Permissions('manage_blog_posts')
    create(@Body() createBlogPostDto: CreateBlogPostDto, @Req() req: Request) {
        const user = req.user as any;
        return this.blogPostsService.create(createBlogPostDto, user.id);
    }

    @Get()
    findAll() {
        return this.blogPostsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.blogPostsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Patch(':id')
    @Permissions('manage_blog_posts')
    update(@Param('id') id: string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
        return this.blogPostsService.update(id, updateBlogPostDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Delete(':id')
    @Permissions('manage_blog_posts')
    remove(@Param('id') id: string) {
        return this.blogPostsService.remove(id);
    }
}