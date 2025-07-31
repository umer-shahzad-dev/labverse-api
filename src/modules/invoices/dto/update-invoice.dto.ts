import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoicePaymentStatus } from '../entities/invoice.entity';
import { CreateInvoiceItemDto } from './create-invoice-item.dto'; // Reuse for update as well for simplicity
// If you need to update existing items by ID, you'd need a separate DTO like UpdateInvoiceItemDto with an 'id' field.
// For now, we'll assume item updates mean replacing the array or providing full items.

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    @IsEnum(InvoicePaymentStatus)
    @IsOptional()
    paymentStatus?: InvoicePaymentStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateInvoiceItemDto) // Can accept new items on update
    @IsOptional()
    items?: CreateInvoiceItemDto[];
}