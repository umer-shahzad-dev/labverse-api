import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectClientsService } from './project-clients.service';
import { ProjectClientsController } from './project-clients.controller';
import { ProjectClient } from './entities/project-client.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity
import { User } from '../users/entities/user.entity'; // Import User entity

@Module({
    imports: [TypeOrmModule.forFeature([ProjectClient, Project, User])], // Provide repositories
    controllers: [ProjectClientsController],
    providers: [ProjectClientsService],
    exports: [ProjectClientsService],
})
export class ProjectClientsModule { }