import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { Conversation } from '../conversations/entities/conversation.entity';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(ConversationParticipant)
        private participantRepository: Repository<ConversationParticipant>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<Message> {
        const { conversationId, content } = createMessageDto;

        // Verify user is a participant of the conversation
        const participant = await this.participantRepository.findOne({
            where: { userId: senderId, conversationId },
        });
        if (!participant) {
            throw new BadRequestException('You are not a participant in this conversation.');
        }

        const message = this.messageRepository.create({
            conversationId,
            senderId,
            content,
        });
        const savedMessage = await this.messageRepository.save(message);

        // Update conversation's lastMessageSentAt for sorting
        await this.conversationRepository.update(conversationId, {
            lastMessageSentAt: savedMessage.createdAt,
        });

        return savedMessage;
    }

    async getMessagesByConversation(userId: string, conversationId: string): Promise<Message[]> {
        // Verify user is a participant
        const participant = await this.participantRepository.findOne({
            where: { userId, conversationId },
        });
        if (!participant) {
            throw new BadRequestException('You are not a participant in this conversation.');
        }

        // Mark messages as read for this user
        await this.markAsRead(userId, conversationId);

        return this.messageRepository.find({
            where: { conversationId },
            relations: ['sender'],
            order: { createdAt: 'ASC' },
        });
    }

    async markAsRead(userId: string, conversationId: string): Promise<void> {
        const latestMessage = await this.messageRepository.findOne({
            where: { conversationId },
            order: { createdAt: 'DESC' },
        });

        if (latestMessage) {
            await this.participantRepository.update(
                { userId, conversationId },
                { lastReadMessageId: latestMessage.id }
            );
        }
    }

    // This is the fully corrected method for getting unread message counts.
    async getUnreadCount(userId: string): Promise<{ conversationId: string; unreadCount: number }[]> {
        const participants = await this.participantRepository.find({
            where: { userId },
        });

        const results = [];
        for (const participant of participants) {
            // Case 1: User has read some messages, so count messages after the last one they saw.
            if (participant.lastReadMessageId) {
                const unreadMessagesCount = await this.messageRepository
                    .createQueryBuilder('message')
                    .where('message.conversationId = :conversationId', { conversationId: participant.conversationId })
                    // The key part: checking message.id > lastReadMessageId
                    .andWhere('message.id > :lastReadMessageId', { lastReadMessageId: participant.lastReadMessageId })
                    .getCount();

                if (unreadMessagesCount > 0) {
                    results.push({ conversationId: participant.conversationId, unreadCount: unreadMessagesCount });
                }
            } else {
                // Case 2: User has never read any messages, so all messages are unread.
                const totalMessagesCount = await this.messageRepository
                    .count({ where: { conversationId: participant.conversationId } });

                if (totalMessagesCount > 0) {
                    results.push({ conversationId: participant.conversationId, unreadCount: totalMessagesCount });
                }
            }
        }

        return results;
    }
}