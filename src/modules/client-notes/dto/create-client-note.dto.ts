import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateClientNoteDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsOptional()
    clientId?: string;

    @IsUUID()
    @IsOptional()
    leadId?: string;
}