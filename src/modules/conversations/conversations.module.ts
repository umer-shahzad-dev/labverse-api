import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from '../messages/entities/message.entity'; // For conversation last message
import { User } from '../users/entities/user.entity'; // For participants

@Module({
    imports: [TypeOrmModule.forFeature([Conversation, ConversationParticipant, Message, User])],
    controllers: [ConversationsController],
    providers: [ConversationsService],
    exports: [ConversationsService, TypeOrmModule.forFeature([Conversation, ConversationParticipant])],
})
export class ConversationsModule { }