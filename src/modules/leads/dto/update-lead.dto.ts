import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateLeadDto } from './create-lead.dto';
import { LeadStatus } from '../enums/lead-status.enum';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
    @IsEnum(LeadStatus)
    @IsOptional()
    status?: LeadStatus;
}