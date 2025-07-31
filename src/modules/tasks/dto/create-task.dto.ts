import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsOptional,
    IsEnum,
    IsDateString,
    MaxLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255) // Assuming a reasonable max length for task name
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsNotEmpty()
    projectId: string; // The project this task belongs to

    @IsUUID()
    @IsOptional()
    milestoneId?: string; // Optional: The milestone this task belongs to

    @IsUUID()
    @IsOptional()
    assignedToUserId?: string; // Optional: The user this task is assigned to

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus = TaskStatus.TODO;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority = TaskPriority.MEDIUM;

    @IsDateString()
    @IsOptional()
    dueDate?: string; // ISO 8601 date string (e.g., "2024-12-31")
}