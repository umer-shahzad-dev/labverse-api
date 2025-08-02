import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    // A slug is a URL-friendly string, typically lowercase with no spaces.
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;
}