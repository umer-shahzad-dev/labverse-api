import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsString()
    @IsOptional()
    authorTitle?: string;
}