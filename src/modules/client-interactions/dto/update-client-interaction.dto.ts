import { PartialType } from '@nestjs/mapped-types';
import { CreateClientInteractionDto } from './create-client-interaction.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { InteractionType } from '../enums/interaction-type.enum';

export class UpdateClientInteractionDto extends PartialType(CreateClientInteractionDto) {
    @IsEnum(InteractionType)
    @IsOptional()
    type?: InteractionType;
}