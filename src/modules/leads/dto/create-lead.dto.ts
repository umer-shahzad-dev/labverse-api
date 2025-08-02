import { IsNotEmpty, IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';
import { LeadStatus } from '../enums/lead-status.enum';

export class CreateLeadDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    company?: string;

    @IsString()
    @IsOptional()
    source?: string;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;
}