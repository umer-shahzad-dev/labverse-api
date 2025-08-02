import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsNotEmpty()
    questionId: string;
}