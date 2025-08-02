import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TestimonialsService {
    constructor(
        @InjectRepository(Testimonial)
        private readonly testimonialRepository: Repository<Testimonial>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createTestimonialDto: CreateTestimonialDto, createdById: string): Promise<Testimonial> {
        const createdBy = await this.userRepository.findOne({ where: { id: createdById } });
        // This check is optional since the relationship is nullable, but good for feedback
        if (!createdBy) {
            throw new NotFoundException(`User with ID "${createdById}" not found.`);
        }

        const newTestimonial = this.testimonialRepository.create({
            ...createTestimonialDto,
            createdBy,
        });

        return this.testimonialRepository.save(newTestimonial);
    }

    async findAll(): Promise<Testimonial[]> {
        return this.testimonialRepository.find({ relations: ['createdBy'] });
    }

    async findOne(id: string): Promise<Testimonial> {
        const testimonial = await this.testimonialRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID "${id}" not found.`);
        }
        return testimonial;
    }

    async update(id: string, updateTestimonialDto: UpdateTestimonialDto, currentUserId: string): Promise<Testimonial> {
        const testimonial = await this.testimonialRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID "${id}" not found.`);
        }

        // Authorization check: only the user who created the testimonial can update it
        if (testimonial.createdBy && testimonial.createdBy.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to update this testimonial.');
        }

        this.testimonialRepository.merge(testimonial, updateTestimonialDto);
        return this.testimonialRepository.save(testimonial);
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        const testimonial = await this.testimonialRepository.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!testimonial) {
            throw new NotFoundException(`Testimonial with ID "${id}" not found.`);
        }

        // Authorization check: only the user who created the testimonial can delete it
        if (testimonial.createdBy && testimonial.createdBy.id !== currentUserId) {
            throw new UnauthorizedException('You do not have permission to delete this testimonial.');
        }

        await this.testimonialRepository.remove(testimonial);
    }
}