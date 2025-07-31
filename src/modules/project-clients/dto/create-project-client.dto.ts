import { IsUUID, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateProjectClientDto {
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string; // The user (client) being assigned

    @IsOptional()
    @IsDateString()
    assignedAt?: string;
}