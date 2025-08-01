import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}