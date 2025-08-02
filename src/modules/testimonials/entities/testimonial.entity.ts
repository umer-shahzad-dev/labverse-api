import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('testimonials')
export class Testimonial {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('text', { name: 'content' })
    content: string;

    @Column({ name: 'author_name' })
    authorName: string;

    @Column({ name: 'author_title', nullable: true })
    authorTitle: string; // e.g., "CEO of Acme Inc."

    @ManyToOne(() => User, (user) => user.testimonials, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    createdBy: User;

    @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
    createdById: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
