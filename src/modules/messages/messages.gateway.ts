import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets/interfaces';
import { ConversationParticipant } from '../conversations/entities/conversation-participant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@WebSocketGateway({
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: false,
    },
    transports: ['websocket'], // force WebSocket only (optional but cleaner for test)
})
// Adjust CORS for development
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
        @InjectRepository(ConversationParticipant)
        private participantRepository: Repository<ConversationParticipant>,
    ) { }

    async handleConnection(client: Socket) {
        // ✅ Support token from header or query
        const token =
            client.handshake.headers['authorization']?.replace('Bearer ', '') ||
            (client.handshake.query.token as string) ||
            client.handshake.auth?.token;

        if (!token) {
            console.log('❌ No token provided, disconnecting client...');
            client.disconnect(true);
            return;
        }

        try {
            const decodedToken = this.jwtService.verify(token);
            client.data.user = decodedToken;
        } catch (error) {
            console.log('❌ JWT verification failed:', error.message);
            client.disconnect(true);
            return;
        }

        console.log(`✅ Client connected: ${client.id}`);
        const userId = client.data.user.id;

        // Join rooms for all conversations the user is a part of
        const participants = await this.participantRepository.find({
            where: { userId },
        });
        participants.forEach((p) => {
            client.join(p.conversationId);
        });
    }

    handleDisconnect(client: Socket) {
        console.log(`❌ Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() data: CreateMessageDto,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        const senderId = client.data.user.id;
        if (!senderId) {
            throw new UnauthorizedException('Sender not authenticated.');
        }

        try {
            const savedMessage = await this.messagesService.createMessage(senderId, data);
            this.server.to(savedMessage.conversationId).emit('receiveMessage', savedMessage);
        } catch (error) {
            client.emit('error', error.message);
        }
    }

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(
        @MessageBody() conversationId: string,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        const userId = client.data.user.id;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated.');
        }

        try {
            await this.messagesService.markAsRead(userId, conversationId);
            client.to(conversationId).emit('messagesRead', { userId, conversationId });
        } catch (error) {
            client.emit('error', error.message);
        }
    }
}
