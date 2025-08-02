import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseStudiesService } from './case-studies.service';
import { CaseStudy } from './entities/case-study.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { CaseStudiesController } from './case-studies.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CaseStudy, User, Category])],
    providers: [CaseStudiesService],
    controllers: [CaseStudiesController], 
})
export class CaseStudiesModule { }