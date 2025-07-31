import { IsUUID, IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateDevelopmentPlanServiceDto {
    @IsUUID()
    @IsNotEmpty()
    developmentPlanId: string;

    @IsUUID()
    @IsNotEmpty()
    serviceId: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    customPrice?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    quantity?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}