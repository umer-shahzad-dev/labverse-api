import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TaskComment } from './entities/task-comment.entity';
import { Project } from '../projects/entities/project.entity'; // Import Project entity
import { ProjectMilestone } from '../project-milestones/entities/project-milestone.entity'; // Import ProjectMilestone entity
import { User } from '../users/entities/user.entity'; // Import User entity

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, TaskComment, Project, ProjectMilestone, User]), // Include all related entities
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService], // Export if other modules might need to use TasksService
})
export class TasksModule { }