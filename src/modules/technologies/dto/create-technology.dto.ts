import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTechnologyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}