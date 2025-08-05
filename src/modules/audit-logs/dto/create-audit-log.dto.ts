import { IsNotEmpty, IsString, IsOptional, IsJSON } from 'class-validator';

export class CreateAuditLogDto {
    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    entityName: string;

    @IsString()
    @IsOptional()
    entityId?: string;

    @IsJSON()
    @IsOptional()
    details?: object;
}