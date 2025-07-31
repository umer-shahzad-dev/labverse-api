import { IsUUID, IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateDevelopmentPlanFeatureDto {
    @IsUUID()
    @IsNotEmpty()
    developmentPlanId: string;

    @IsUUID()
    @IsNotEmpty()
    planFeatureId: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    priceAdjustment?: number;

    @IsString()
    @IsOptional()
    notes?: string;
}