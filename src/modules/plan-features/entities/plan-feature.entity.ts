import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { DevelopmentPlanFeature } from '../../development-plans/entities/development-plan-feature.entity';

@Entity('plan_features')
export class PlanFeature {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // This could be a default price adjustment if this feature is added to a plan
    @Column({ name: 'default_price_adjustment', type: 'numeric', precision: 10, scale: 2, nullable: true, default: 0.00 })
    defaultPriceAdjustment: number;

    @Column({ name: 'is_active', default: true })
    isActive: boolean; // Whether this feature is generally available to be included in plans


    @OneToMany(() => DevelopmentPlanFeature, (dpf) => dpf.planFeature)
    developmentPlanFeatures: DevelopmentPlanFeature[];
}