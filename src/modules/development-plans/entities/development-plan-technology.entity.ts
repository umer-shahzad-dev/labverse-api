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
import { Technology } from '../../technologies/entities/technology.entity';

@Entity('development_plan_technologies')
@Unique(['developmentPlanId', 'technologyId']) // Prevents duplicate entries
export class DevelopmentPlanTechnology {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Keys ---

    @Column({ name: 'development_plan_id', type: 'uuid' })
    developmentPlanId: string;

    @Column({ name: 'technology_id', type: 'uuid' })
    technologyId: string;

    // --- Relationships ---

    @ManyToOne(() => DevelopmentPlan, (plan) => plan.planTechnologies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'development_plan_id' })
    developmentPlan: DevelopmentPlan;

    @ManyToOne(() => Technology, (technology) => technology.developmentPlanTechnologies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'technology_id' })
    technology: Technology;
}
