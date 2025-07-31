import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus; // Allow updating status without assigning all of CreateTaskDto

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority; // Allow updating priority

    @IsUUID()
    @IsOptional()
    assignedToUserId?: string; // Allow re-assigning task
}