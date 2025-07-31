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
import { PlanFeature } from '../../plan-features/entities/plan-feature.entity';

@Entity('development_plan_features')
@Unique(['developmentPlanId', 'planFeatureId']) // Prevents duplicate feature-plan pairs
export class DevelopmentPlanFeature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        name: 'price_adjustment',
        type: 'numeric',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0.0,
    })
    priceAdjustment: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Keys ---

    @Column({ name: 'development_plan_id', type: 'uuid' })
    developmentPlanId: string;

    @Column({ name: 'plan_feature_id', type: 'uuid' })
    planFeatureId: string;

    // --- Relationships ---

    @ManyToOne(() => DevelopmentPlan, (plan) => plan.planFeatures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'development_plan_id' })
    developmentPlan: DevelopmentPlan;

    @ManyToOne(() => PlanFeature, (feature) => feature.developmentPlanFeatures, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'plan_feature_id' })
    planFeature: PlanFeature;
}
