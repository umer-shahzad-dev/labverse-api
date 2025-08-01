import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
    constructor(
        @InjectRepository(Conversation)
        private conversationRepository: Repository<Conversation>,
        @InjectRepository(ConversationParticipant)
        private participantRepository: Repository<ConversationParticipant>,
    ) { }

    async createConversation(creatorId: string, createConversationDto: CreateConversationDto): Promise<Conversation> {
        const { name, participantIds } = createConversationDto;

        // Check for existing 1-on-1 conversation
        if (!name && participantIds.length === 1) {
            const existingConversation = await this.find1on1Conversation(creatorId, participantIds[0]);
            if (existingConversation) {
                return existingConversation;
            }
        }

        const conversation = this.conversationRepository.create({
            name,
            isGroup: participantIds.length > 1 || !!name,
        });
        const savedConversation = await this.conversationRepository.save(conversation);

        // Add all participants, including the creator
        const allParticipantIds = [...new Set([creatorId, ...participantIds])];
        const participants = allParticipantIds.map(userId => this.participantRepository.create({
            conversationId: savedConversation.id,
            userId,
        }));
        await this.participantRepository.save(participants);

        return this.conversationRepository.findOne({
            where: { id: savedConversation.id },
            relations: ['participants.user'],
        });
    }

    async find1on1Conversation(userId1: string, userId2: string): Promise<Conversation> {
        const participant1 = await this.participantRepository.find({ where: { userId: userId1 }, relations: ['conversation'] });
        const participant2 = await this.participantRepository.find({ where: { userId: userId2 }, relations: ['conversation'] });

        for (const p1 of participant1) {
            for (const p2 of participant2) {
                if (p1.conversationId === p2.conversationId && !p1.conversation.isGroup) {
                    return this.conversationRepository.findOne({
                        where: { id: p1.conversationId },
                        relations: ['participants.user'],
                    });
                }
            }
        }
        return null;
    }

    async getConversationsForUser(userId: string): Promise<Conversation[]> {
        return this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.participants', 'participant')
            .where('participant.userId = :userId', { userId })
            .leftJoinAndSelect('conversation.participants', 'participants_all')
            .leftJoinAndSelect('participants_all.user', 'user')
            .leftJoinAndSelect('conversation.messages', 'messages') // Join messages to get last message content
            .orderBy('conversation.lastMessageSentAt', 'DESC')
            .getMany();
    }

    async getConversationById(userId: string, conversationId: string): Promise<Conversation> {
        const conversation = await this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.participants', 'participant')
            .where('conversation.id = :conversationId', { conversationId })
            .andWhere('participant.userId = :userId', { userId }) // Ensure user is a participant
            .leftJoinAndSelect('conversation.participants', 'participants_all')
            .leftJoinAndSelect('participants_all.user', 'user')
            .getOne();

        if (!conversation) {
            throw new NotFoundException(`Conversation with ID "${conversationId}" not found or you are not a participant.`);
        }

        return conversation;
    }
}