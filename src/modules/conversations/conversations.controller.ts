import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
// Import the new custom Request type
import { AuthRequest } from '../../common/types/auth-request.interface';

@Controller('conversations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @Post()
    @Permissions('create_conversation')
    create(@Body() createConversationDto: CreateConversationDto, @Req() req: AuthRequest) {
        const creatorId = req.user.id; // Corrected: use dot notation for type safety
        return this.conversationsService.createConversation(creatorId, createConversationDto);
    }

    @Get()
    @Permissions('read_conversation')
    findAllForUser(@Req() req: AuthRequest) {
        const userId = req.user.id; // Corrected: use dot notation
        return this.conversationsService.getConversationsForUser(userId);
    }

    @Get(':id')
    @Permissions('read_conversation')
    findOne(@Param('id') id: string, @Req() req: AuthRequest) {
        const userId = req.user.id; // Corrected: use dot notation
        return this.conversationsService.getConversationById(userId, id);
    }
}