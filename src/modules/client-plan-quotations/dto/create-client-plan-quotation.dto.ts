import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min, IsEnum, IsDateString, IsString } from 'class-validator';
import { QuotationStatus } from '../entities/client-plan-quotation.entity'; // Import the enum

export class CreateClientPlanQuotationDto {
    @IsUUID()
    @IsNotEmpty()
    clientId: string;

    @IsUUID()
    @IsNotEmpty()
    developmentPlanId: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    quotedPrice?: number; // Optional on creation, can be calculated by service

    @IsEnum(QuotationStatus)
    @IsOptional()
    status?: QuotationStatus;

    @IsDateString()
    @IsOptional()
    validUntil?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}