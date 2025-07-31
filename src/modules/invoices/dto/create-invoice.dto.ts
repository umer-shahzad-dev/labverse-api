import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min, IsEnum, IsDateString, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoicePaymentStatus } from '../entities/invoice.entity';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';

export class CreateInvoiceDto {
    @IsUUID()
    @IsNotEmpty()
    clientId: string;

    @IsUUID()
    @IsOptional()
    quotationId?: string; // Optional, if invoice is generated from a quote

    @IsDateString()
    @IsNotEmpty()
    issueDate: string;

    @IsDateString()
    @IsNotEmpty()
    dueDate: string;

    @IsEnum(InvoicePaymentStatus)
    @IsOptional()
    paymentStatus?: InvoicePaymentStatus;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto)
    @IsNotEmpty({ message: 'Invoice must have at least one item' })
    items: CreateInvoiceItemDto[];
}