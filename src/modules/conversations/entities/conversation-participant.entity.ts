import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('conversation_participants')
export class ConversationParticipant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // --- Foreign Keys ---

    @Column({ name: 'conversation_id', type: 'uuid' })
    conversationId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'last_read_message_id', type: 'uuid', nullable: true })
    lastReadMessageId: string;

    // --- Timestamps ---

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Relationships ---

    @ManyToOne(() => Conversation, (conversation) => conversation.participants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'conversation_id' })
    conversation: Conversation;

    @ManyToOne(() => User, (user) => user.conversationParticipants, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Message, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'last_read_message_id' })
    lastReadMessage: Message;
}
