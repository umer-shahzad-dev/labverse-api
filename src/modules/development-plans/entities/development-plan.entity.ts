import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { DevelopmentPlanFeature } from './development-plan-feature.entity'; 
import { DevelopmentPlanService } from './development-plan-service.entity'; 
import { DevelopmentPlanTechnology } from './development-plan-technology.entity'; 
// import { ClientPlanQuotation } from '../../client-plan-quotations/entities/client-plan-quotation.entity'; // Will create later

@Entity('development_plans')
export class DevelopmentPlan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'base_price', type: 'numeric', precision: 10, scale: 2, default: 0.00 })
    basePrice: number; // The base price for this plan

    @Column({ name: 'is_active', default: true })
    isActive: boolean; // Whether the plan is currently offered

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Relationships to Junction Tables (Many-to-Many) ---

    @OneToMany(() => DevelopmentPlanFeature, (dpf) => dpf.developmentPlan)
    planFeatures: DevelopmentPlanFeature[]; 

    @OneToMany(() => DevelopmentPlanService, (dps) => dps.developmentPlan)
    planServices: DevelopmentPlanService[]; 

    @OneToMany(() => DevelopmentPlanTechnology, (dpt) => dpt.developmentPlan)
    planTechnologies: DevelopmentPlanTechnology[];

    // // --- Relationship to ClientPlanQuotation (One-to-Many) ---
    // @OneToMany(() => ClientPlanQuotation, (quote) => quote.developmentPlan)
    // clientQuotations: ClientPlanQuotation[]; // Quotations based on this plan
}