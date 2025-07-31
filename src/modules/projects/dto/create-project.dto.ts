import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator'; // 👈 Import IsUUID
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @IsUUID()
    @IsOptional()
    createdById?: string;
}