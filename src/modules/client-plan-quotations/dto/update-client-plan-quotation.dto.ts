import { PartialType } from '@nestjs/mapped-types';
import { CreateClientPlanQuotationDto } from './create-client-plan-quotation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { QuotationStatus } from '../entities/client-plan-quotation.entity';

export class UpdateClientPlanQuotationDto extends PartialType(CreateClientPlanQuotationDto) {
    @IsEnum(QuotationStatus)
    @IsOptional()
    status?: QuotationStatus; // Allow status updates explicitly
}