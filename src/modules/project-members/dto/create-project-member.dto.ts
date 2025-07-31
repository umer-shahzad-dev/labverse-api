import { IsUUID, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ProjectRole } from '../entities/project-member.entity';

export class CreateProjectMemberDto {
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string; // The user (employee) being assigned

    @IsEnum(ProjectRole)
    @IsNotEmpty()
    roleOnProject: ProjectRole;

    @IsOptional()
    @IsDateString()
    assignmentDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;
}