import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity'; // Import User entity

@Module({
    imports: [TypeOrmModule.forFeature([Project, User])], // Provide Project and User repositories
    controllers: [ProjectsController],
    providers: [ProjectsService],
    exports: [ProjectsService],
})
export class ProjectsModule { }