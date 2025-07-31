import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDevelopmentPlanTechnologyDto {
    @IsUUID()
    @IsNotEmpty()
    developmentPlanId: string;

    @IsUUID()
    @IsNotEmpty()
    technologyId: string;

    @IsString()
    @IsOptional()
    notes?: string;
}