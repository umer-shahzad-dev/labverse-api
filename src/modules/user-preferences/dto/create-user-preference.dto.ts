import { IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';

export class CreateUserPreferenceDto {
    @IsOptional()
    @IsString()
    theme?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsBoolean()
    receiveNotifications?: boolean;
}
