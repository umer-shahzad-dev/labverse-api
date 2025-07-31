import { IsUUID, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectTechnologyDto {
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsNotEmpty()
    technologyId: string;

    @IsOptional()
    @IsDateString()
    assignedAt?: string;
}