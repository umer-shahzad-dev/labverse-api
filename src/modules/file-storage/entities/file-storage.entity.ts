import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('file_storage')
export class FileStorage {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'mime_type' })
    mimeType: string;

    @Column('bigint', { name: 'file_size' })
    fileSize: number; // Stored in bytes

    @Column({ name: 's3_url' })
    s3Url: string;

    @ManyToOne(() => User, (user) => user.files, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'uploaded_by_id' })
    uploadedBy: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
