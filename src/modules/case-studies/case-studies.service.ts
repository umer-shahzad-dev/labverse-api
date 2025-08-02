import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseStudy } from './entities/case-study.entity';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CaseStudiesService {
    constructor(
        @InjectRepository(CaseStudy)
        private readonly caseStudyRepository: Repository<CaseStudy>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCaseStudyDto: CreateCaseStudyDto, authorId: string): Promise<CaseStudy> {
        const { categoryId, ...data } = createCaseStudyDto;

        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        let category: Category | null = null;
        if (categoryId) {
            category = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                throw new NotFoundException(`Category with ID "${categoryId}" not found.`);
            }
        }

        const newCaseStudy = this.caseStudyRepository.create({
            ...data,
            author,
            category,
        });

        return this.caseStudyRepository.save(newCaseStudy);
    }

    async findAll(): Promise<CaseStudy[]> {
        return this.caseStudyRepository.find({ relations: ['author', 'category'] });
    }

    async findOne(id: string): Promise<CaseStudy> {
        const caseStudy = await this.caseStudyRepository.findOne({
            where: { id },
            relations: ['author', 'category'],
        });
        if (!caseStudy) {
            throw new NotFoundException(`Case Study with ID "${id}" not found.`);
        }
        return caseStudy;
    }

    async update(id: string, updateCaseStudyDto: UpdateCaseStudyDto, currentUserId: string): Promise<CaseStudy> {
        const caseStudy = await this.caseStudyRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!caseStudy) {
            throw new NotFoundException(`Case Study with ID "${id}" not found.`);
        }

        // Authorization check: only the author can update their case study
        if (caseStudy.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this case study.');
        }

        this.caseStudyRepository.merge(caseStudy, updateCaseStudyDto);
        return this.caseStudyRepository.save(caseStudy);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const caseStudy = await this.caseStudyRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!caseStudy) {
            throw new NotFoundException(`Case Study with ID "${id}" not found.`);
        }

        // Authorization check: only the author can delete their case study
        if (caseStudy.author.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this case study.');
        }

        await this.caseStudyRepository.remove(caseStudy);
    }
}