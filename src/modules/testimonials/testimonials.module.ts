import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestimonialsService } from './testimonials.service';
import { Testimonial } from './entities/testimonial.entity';
import { User } from '../users/entities/user.entity';
import { TestimonialsController } from './testimonials.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Testimonial, User])],
    providers: [TestimonialsService],
    controllers: [TestimonialsController],
})
export class TestimonialsModule { }