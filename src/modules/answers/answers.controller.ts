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
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('answers')
export class AnswersController {
    constructor(private readonly answersService: AnswersService) { }

    @Post()
    @Permissions('manage_answers')
    create(@Body() createAnswerDto: CreateAnswerDto, @Req() req: Request) {
        const user = req.user;
        return this.answersService.create(createAnswerDto, user.id);
    }

    @Get('/question/:questionId')
    @Permissions('manage_answers')
    findAllByQuestionId(@Param('questionId') questionId: string) {
        return this.answersService.findAllByQuestionId(questionId);
    }

    @Get(':id')
    @Permissions('manage_answers')
    findOne(@Param('id') id: string) {
        return this.answersService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_answers')
    update(
        @Param('id') id: string,
        @Body() updateAnswerDto: UpdateAnswerDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.answersService.update(id, updateAnswerDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_answers')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.answersService.remove(id, user.id);
    }
}