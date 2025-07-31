import { IsUUID, IsDateString, IsOptional, IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTimeEntryDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string; // The user logging the time

    @IsUUID()
    @IsNotEmpty()
    projectId: string; // The project the time is logged against

    @IsUUID()
    @IsOptional()
    taskId?: string; // Optional: The specific task within the project

    @IsDateString()
    @IsNotEmpty()
    startTime: string; // ISO 8601 string, e.g., "2023-01-01T09:00:00Z"

    @IsDateString()
    @IsNotEmpty()
    endTime: string; // ISO 8601 string, e.g., "2023-01-01T17:00:00Z"

    @IsString()
    @IsOptional()
    description?: string;
}