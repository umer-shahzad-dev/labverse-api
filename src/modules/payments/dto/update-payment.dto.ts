import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentDto } from './create-payment.dto';
import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator'; 
import { Type } from 'class-transformer'; 
import { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
    @IsNumber()
    @Min(0.01)
    @IsOptional()
    @Type(() => Number) 
    amount?: number;

    @IsEnum(PaymentStatus)
    @IsOptional()
    status?: PaymentStatus;
}