import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_preferences')
export class UserPreference {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'theme', default: 'light' })
    theme: string;

    @Column({ name: 'language', default: 'en' })
    language: string;

    @Column({ name: 'receive_notifications', default: true })
    receiveNotifications: boolean;

    @OneToOne(() => User, (user) => user.userPreference, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
