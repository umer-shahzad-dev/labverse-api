import {
    Injectable,
    Inject,
    forwardRef,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
    ) { }

    async create(dto: CreateNotificationDto): Promise<Notification> {
        const notification = this.notificationRepository.create(dto);
        return this.notificationRepository.save(notification);
    }

    async findUserNotifications(user: User): Promise<Notification[]> {
        return this.notificationRepository.find({
            where: { userId: user.id },
            order: { createdAt: 'DESC' },
        });
    }

    async findUnreadCount(user: User): Promise<number> {
        return this.notificationRepository.count({
            where: { userId: user.id, status: NotificationStatus.UNREAD },
        });
    }

    /**
     * Updates a notification's status.
     */
    async update(id: string, user: User, dto: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.notificationRepository.findOne({
            where: { id, userId: user.id },
        });
        if (!notification) {
            throw new NotFoundException('Notification not found.');
        }

        Object.assign(notification, dto);
        return this.notificationRepository.save(notification);
    }
}
