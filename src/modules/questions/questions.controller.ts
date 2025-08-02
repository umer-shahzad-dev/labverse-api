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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Post()
    @Permissions('manage_questions')
    create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: Request) {
        const user = req.user;
        return this.questionsService.create(createQuestionDto, user.id);
    }

    @Get()
    @Permissions('manage_questions')
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    @Permissions('manage_questions')
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_questions')
    update(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.questionsService.update(id, updateQuestionDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_questions')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.questionsService.remove(id, user.id);
    }
}