import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMembersService } from './project-members.service';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity
import { User } from '../users/entities/user.entity'; // Import User entity

@Module({
    imports: [TypeOrmModule.forFeature([ProjectMember, Project, User])], // Provide ProjectMember, Project, and User repositories
    controllers: [ProjectMembersController],
    providers: [ProjectMembersService],
    exports: [ProjectMembersService],
})
export class ProjectMembersModule { }