import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeEntry } from './entities/time-entry.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class TimeEntriesService {
    constructor(
        @InjectRepository(TimeEntry)
        private timeEntryRepository: Repository<TimeEntry>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) { }

    private calculateDurationMinutes(startTime: Date, endTime: Date): number {
        const durationMs = endTime.getTime() - startTime.getTime();
        if (durationMs < 0) {
            throw new BadRequestException('End time cannot be before start time.');
        }
        // Convert milliseconds to minutes, rounded to 2 decimal places
        return parseFloat((durationMs / (1000 * 60)).toFixed(2));
    }

    async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
        const { userId, projectId, taskId, startTime, endTime, description } = createTimeEntryDto;

        // Validate relationships
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${userId}" not found.`);
        }

        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }

        let task: Task | undefined;
        if (taskId) {
            task = await this.taskRepository.findOne({ where: { id: taskId, projectId: projectId } });
            if (!task) {
                throw new NotFoundException(`Task with ID "${taskId}" not found or does not belong to Project ID "${projectId}".`);
            }
        }

        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(endTime);
        const durationMinutes = this.calculateDurationMinutes(parsedStartTime, parsedEndTime);

        const timeEntry = this.timeEntryRepository.create({
            user,
            userId,
            project,
            projectId,
            task,
            taskId,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            durationMinutes,
            description,
        });

        return this.timeEntryRepository.save(timeEntry);
    }

    async findAll(): Promise<TimeEntry[]> {
        return this.timeEntryRepository.find({
            relations: ['user', 'project', 'task'],
            order: { startTime: 'DESC' },
        });
    }

    async findOne(id: string): Promise<TimeEntry> {
        const timeEntry = await this.timeEntryRepository.findOne({
            where: { id },
            relations: ['user', 'project', 'task'],
        });
        if (!timeEntry) {
            throw new NotFoundException(`Time Entry with ID "${id}" not found.`);
        }
        return timeEntry;
    }

    async update(id: string, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
        const timeEntry = await this.timeEntryRepository.findOne({ where: { id } });
        if (!timeEntry) {
            throw new NotFoundException(`Time Entry with ID "${id}" not found.`);
        }

        // Prepare data for update, handle dates and duration calculation
        const updatedData: Partial<TimeEntry> = {};
        if (updateTimeEntryDto.startTime) {
            updatedData.startTime = new Date(updateTimeEntryDto.startTime);
        }
        if (updateTimeEntryDto.endTime) {
            updatedData.endTime = new Date(updateTimeEntryDto.endTime);
        }

        // Re-calculate duration if start or end time changed
        if (updatedData.startTime || updatedData.endTime) {
            const newStartTime = updatedData.startTime || timeEntry.startTime;
            const newEndTime = updatedData.endTime || timeEntry.endTime;
            updatedData.durationMinutes = this.calculateDurationMinutes(newStartTime, newEndTime);
        }

        // Handle optional taskId update
        if (updateTimeEntryDto.taskId !== undefined) {
            if (updateTimeEntryDto.taskId === null) {
                updatedData.task = null;
                updatedData.taskId = null;
            } else {
                const task = await this.taskRepository.findOne({
                    where: { id: updateTimeEntryDto.taskId, projectId: updateTimeEntryDto.projectId || timeEntry.projectId },
                });
                if (!task) {
                    throw new NotFoundException(`Task with ID "${updateTimeEntryDto.taskId}" not found or does not belong to the specified project.`);
                }
                updatedData.task = task;
                updatedData.taskId = updateTimeEntryDto.taskId;
            }
        }

        // Assign other simple fields
        Object.assign(timeEntry, { ...updateTimeEntryDto, ...updatedData });

        return this.timeEntryRepository.save(timeEntry);
    }

    async remove(id: string): Promise<void> {
        const result = await this.timeEntryRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Time Entry with ID "${id}" not found.`);
        }
    }

    // --- Reporting Methods (will be expanded later) ---
    async findTimeEntriesByProject(projectId: string): Promise<TimeEntry[]> {
        return this.timeEntryRepository.find({
            where: { projectId },
            relations: ['user', 'task'],
            order: { startTime: 'ASC' },
        });
    }

    async findTimeEntriesByUser(userId: string): Promise<TimeEntry[]> {
        return this.timeEntryRepository.find({
            where: { userId },
            relations: ['project', 'task'],
            order: { startTime: 'ASC' },
        });
    }
}