import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { DevelopmentPlan } from './development-plan.entity';
import { Service } from '../../services/entities/service.entity';

@Entity('development_plan_services')
@Unique(['developmentPlanId', 'serviceId']) // Prevents duplicate service-plan pairs
export class DevelopmentPlanService {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'custom_price',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    customPrice: number;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    quantity: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Keys ---

    @Column({ name: 'development_plan_id', type: 'uuid' })
    developmentPlanId: string;

    @Column({ name: 'service_id', type: 'uuid' })
    serviceId: string;

    // --- Relationships ---

    @ManyToOne(() => DevelopmentPlan, (plan) => plan.planServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'development_plan_id' })
    developmentPlan: DevelopmentPlan;

    @ManyToOne(() => Service, (service) => service.developmentPlanServices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_id' })
    service: Service;
}
