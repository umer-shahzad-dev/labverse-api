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
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Post()
    @Permissions('manage_testimonials')
    create(@Body() createTestimonialDto: CreateTestimonialDto, @Req() req: Request) {
        const user = req.user;
        return this.testimonialsService.create(createTestimonialDto, user.id);
    }

    @Get()
    @Permissions('manage_testimonials')
    findAll() {
        return this.testimonialsService.findAll();
    }

    @Get(':id')
    @Permissions('manage_testimonials')
    findOne(@Param('id') id: string) {
        return this.testimonialsService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_testimonials')
    update(
        @Param('id') id: string,
        @Body() updateTestimonialDto: UpdateTestimonialDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.testimonialsService.update(id, updateTestimonialDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_testimonials')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.testimonialsService.remove(id, user.id);
    }
}