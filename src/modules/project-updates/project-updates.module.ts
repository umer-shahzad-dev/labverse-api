import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUpdatesService } from './project-updates.service';
import { ProjectUpdatesController } from './project-updates.controller';
import { ProjectUpdate } from './entities/project-update.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity
import { User } from '../users/entities/user.entity'; // Import User entity

@Module({
    imports: [TypeOrmModule.forFeature([ProjectUpdate, Project, User])], // Provide repositories
    controllers: [ProjectUpdatesController],
    providers: [ProjectUpdatesService],
    exports: [ProjectUpdatesService],
})
export class ProjectUpdatesModule { }