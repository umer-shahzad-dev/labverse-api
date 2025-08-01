import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
// Import the new custom Request type
import { AuthRequest } from '../../common/types/auth-request.interface';

@Controller('messages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post()
    @Permissions('send_message')
    create(@Body() createMessageDto: CreateMessageDto, @Req() req: AuthRequest) {
        const senderId = req.user.id; // Corrected: use dot notation
        return this.messagesService.createMessage(senderId, createMessageDto);
    }

    @Get('conversation/:id')
    @Permissions('read_message')
    findByConversation(@Param('id') conversationId: string, @Req() req: AuthRequest) {
        const userId = req.user.id; // Corrected: use dot notation
        return this.messagesService.getMessagesByConversation(userId, conversationId);
    }

    @Get('unread/count')
    @Permissions('read_message')
    getUnreadCounts(@Req() req: AuthRequest) {
        const userId = req.user.id; // Corrected: use dot notation
        return this.messagesService.getUnreadCount(userId);
    }
}