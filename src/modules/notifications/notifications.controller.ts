import {
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
    Req,
    NotFoundException,
    Body,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getUserNotifications(@Req() req: any) {
        const user = req.user as User;
        return this.notificationsService.findUserNotifications(user);
    }

    @Get('unread-count')
    async getUnreadCount(@Req() req: any) {
        const user = req.user as User;
        const count = await this.notificationsService.findUnreadCount(user);
        return { count };
    }

    @Patch(':id')
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateNotificationDto,
        @Req() req: any,
    ) {
        const user = req.user as User;
        return this.notificationsService.update(id, user, dto);
    }
}
