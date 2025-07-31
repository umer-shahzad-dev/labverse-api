import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntriesService } from './time-entries.service';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntry } from './entities/time-entry.entity';
import { User } from '../users/entities/user.entity'; // For TimeEntriesService
import { Project } from '../projects/entities/project.entity'; // For TimeEntriesService
import { Task } from '../tasks/entities/task.entity'; // For TimeEntriesService

@Module({
    imports: [
        TypeOrmModule.forFeature([TimeEntry, User, Project, Task]),
    ],
    controllers: [TimeEntriesController],
    providers: [TimeEntriesService],
    exports: [TimeEntriesService], // Export if other modules need to use TimeEntriesService
})
export class TimeEntriesModule { }