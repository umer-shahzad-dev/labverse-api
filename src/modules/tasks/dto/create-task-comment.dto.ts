import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTaskCommentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(1000) // Assuming a reasonable max length for comments
    comment: string;
}