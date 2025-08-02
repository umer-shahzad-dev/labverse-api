import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBlogPostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;
}