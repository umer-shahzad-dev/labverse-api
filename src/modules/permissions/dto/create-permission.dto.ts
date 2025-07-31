import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    description?: string;
}