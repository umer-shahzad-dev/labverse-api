import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('blog-posts/:blogPostId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    create(
        @Param('blogPostId') blogPostId: string,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req: Request,
    ) {
        const user = req.user as any;
        return this.commentsService.create(createCommentDto, blogPostId, user.id);
    }

    @Get()
    findAll(@Param('blogPostId') blogPostId: string) {
        return this.commentsService.findAll(blogPostId);
    }
}