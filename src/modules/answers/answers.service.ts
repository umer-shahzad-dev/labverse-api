import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { User } from '../users/entities/user.entity';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class AnswersService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) { }

    async create(createAnswerDto: CreateAnswerDto, authorId: string): Promise<Answer> {
        const { questionId, ...data } = createAnswerDto;

        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        const question = await this.questionRepository.findOne({ where: { id: questionId } });
        if (!question) {
            throw new NotFoundException(`Question with ID "${questionId}" not found.`);
        }

        const newAnswer = this.answerRepository.create({
            ...data,
            author,
            question,
        });

        return this.answerRepository.save(newAnswer);
    }

    async findAllByQuestionId(questionId: string): Promise<Answer[]> {
        const question = await this.questionRepository.findOne({ where: { id: questionId } });
        if (!question) {
            throw new NotFoundException(`Question with ID "${questionId}" not found.`);
        }
        return this.answerRepository.find({ where: { question: { id: questionId } }, relations: ['author'] });
    }

    async findOne(id: string): Promise<Answer> {
        const answer = await this.answerRepository.findOne({
            where: { id },
            relations: ['author', 'question'],
        });
        if (!answer) {
            throw new NotFoundException(`Answer with ID "${id}" not found.`);
        }
        return answer;
    }

    async update(id: string, updateAnswerDto: UpdateAnswerDto, currentUserId: string): Promise<Answer> {
        const answer = await this.answerRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!answer) {
            throw new NotFoundException(`Answer with ID "${id}" not found.`);
        }

        // Authorization check: only the author can update their answer
        if (answer.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this answer.');
        }

        this.answerRepository.merge(answer, updateAnswerDto);
        return this.answerRepository.save(answer);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const answer = await this.answerRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!answer) {
            throw new NotFoundException(`Answer with ID "${id}" not found.`);
        }

        // Authorization check: only the author can delete their answer
        if (answer.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this answer.');
        }

        await this.answerRepository.remove(answer);
    }
}