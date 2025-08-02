import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCaseStudyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    summary: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsOptional()
    categoryId?: string;
}