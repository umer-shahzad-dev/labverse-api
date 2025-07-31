import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID, IsEnum } from 'class-validator';
import { MilestoneStatus } from '../entities/project-milestone.entity';

export class CreateProjectMilestoneDto {
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsDateString()
    dueDate?: string;

    @IsOptional()
    @IsDateString()
    completedDate?: string;

    @IsEnum(MilestoneStatus)
    @IsOptional()
    status?: MilestoneStatus;
}