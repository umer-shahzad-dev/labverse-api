import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { User } from '../users/entities/user.entity';
import { Answer } from '../answers/entities/answer.entity';
import { QuestionsController } from './questions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Question, User, Answer])],
    providers: [QuestionsService],
    controllers: [QuestionsController],
})
export class QuestionsModule { }