import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMilestonesService } from './project-milestones.service';
import { ProjectMilestonesController } from './project-milestones.controller';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMilestone, Project])], // Provide repositories
    controllers: [ProjectMilestonesController],
    providers: [ProjectMilestonesService],
    exports: [ProjectMilestonesService],
})
export class ProjectMilestonesModule { }