import { IsUUID, IsNotEmpty, IsOptional, IsNumber, Min, IsEnum, IsDateString, IsString } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
    @IsUUID()
    @IsNotEmpty()
    invoiceId: string;

    @IsNumber()
    @Min(0.01) // Minimum payment amount
    @IsNotEmpty()
    @Type(() => Number)
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    paymentDate: string;

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @IsString()
    @IsOptional()
    transactionId?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;
}
