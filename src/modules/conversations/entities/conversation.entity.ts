import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ConversationParticipant } from './conversation-participant.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', type: 'varchar', nullable: true })
    name: string; // Used for group chats

    @Column({ name: 'is_group', type: 'boolean', default: false })
    isGroup: boolean; // Flag to distinguish group chats from 1-on-1 chats

    @Column({ name: 'last_message_sent_at', type: 'timestamp', nullable: true })
    lastMessageSentAt: Date; // For sorting conversations by recent activity

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Relationships ---

    @OneToMany(() => ConversationParticipant, (participant) => participant.conversation)
    participants: ConversationParticipant[];

    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];
}
