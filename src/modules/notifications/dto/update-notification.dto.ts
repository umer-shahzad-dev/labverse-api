import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../entities/notification.entity';

export class UpdateNotificationDto {
    @IsEnum(NotificationStatus)
    status: NotificationStatus;
}
