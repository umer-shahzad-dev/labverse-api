import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createQuestionDto: CreateQuestionDto, authorId: string): Promise<Question> {
        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        const newQuestion = this.questionRepository.create({
            ...createQuestionDto,
            author,
        });

        return this.questionRepository.save(newQuestion);
    }

    async findAll(): Promise<Question[]> {
        return this.questionRepository.find({ relations: ['author', 'answers'] });
    }

    async findOne(id: string): Promise<Question> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['author', 'answers'],
        });
        if (!question) {
            throw new NotFoundException(`Question with ID "${id}" not found.`);
        }
        return question;
    }

    async update(id: string, updateQuestionDto: UpdateQuestionDto, currentUserId: string): Promise<Question> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!question) {
            throw new NotFoundException(`Question with ID "${id}" not found.`);
        }

        // Authorization check: only the author can update their question
        if (question.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this question.');
        }

        this.questionRepository.merge(question, updateQuestionDto);
        return this.questionRepository.save(question);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!question) {
            throw new NotFoundException(`Question with ID "${id}" not found.`);
        }

        // Authorization check: only the author can delete their question
        if (question.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this question.');
        }

        await this.questionRepository.remove(question);
    }
}