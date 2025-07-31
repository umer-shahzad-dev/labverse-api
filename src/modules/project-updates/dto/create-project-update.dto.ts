import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateProjectUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    projectId: string;

    @IsUUID()
    @IsOptional() // The user who made the update can be optional or derived from auth context
    userId?: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    @IsDateString()
    updateDate?: string;
}