import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
  name: string; // e.g., 'manage_users', 'view_projects'

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
