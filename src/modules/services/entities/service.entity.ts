import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { DevelopmentPlanService } from '../../development-plans/entities/development-plan-service.entity';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', unique: true })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string;

    @Column({ name: 'default_price', type: 'numeric', precision: 10, scale: 2, nullable: true })
    defaultPrice: number; // Optional: A default price per unit

    @Column({ name: 'is_active', default: true })
    isActive: boolean; // Whether the service is currently offered

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => DevelopmentPlanService, (dps) => dps.service)
    developmentPlanServices: DevelopmentPlanService[];
}
