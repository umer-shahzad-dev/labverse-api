import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTechnologiesService } from './project-technologies.service';
import { ProjectTechnologiesController } from './project-technologies.controller';
import { ProjectTechnology } from './entities/project-technology.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity
import { Technology } from '../technologies/entities/technology.entity'; // Import Technology entity

@Module({
    imports: [TypeOrmModule.forFeature([ProjectTechnology, Project, Technology])], // Provide repositories
    controllers: [ProjectTechnologiesController],
    providers: [ProjectTechnologiesService],
    exports: [ProjectTechnologiesService],
})
export class ProjectTechnologiesModule { }