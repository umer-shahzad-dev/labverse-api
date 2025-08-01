import { IsUUID, IsArray, ArrayMinSize, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
    @IsString()
    @IsOptional()
    name?: string; // Optional name for group chats

    @IsArray()
    @ArrayMinSize(1) // A conversation must have at least one other participant besides the creator
    @IsUUID(undefined, { each: true })
    participantIds: string[]; // User IDs of all participants
}