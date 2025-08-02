import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersService } from './answers.service';
import { Answer } from './entities/answer.entity';
import { User } from '../users/entities/user.entity';
import { Question } from '../questions/entities/question.entity';
import { AnswersController } from './answers.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Answer, User, Question])],
    providers: [AnswersService],
    controllers: [AnswersController],
})
export class AnswersModule { }