import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';
import { InteractionType } from '../enums/interaction-type.enum';

export class CreateClientInteractionDto {
    @IsEnum(InteractionType)
    @IsNotEmpty()
    type: InteractionType;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    interactionDate: string;

    @IsUUID()
    @IsOptional()
    interactedWithId?: string;

    @IsUUID()
    @IsOptional()
    interactedWithLeadId?: string;
}