import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    message: string;
}
