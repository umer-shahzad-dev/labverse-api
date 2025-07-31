import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DevelopmentPlan } from '../../development-plans/entities/development-plan.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

export enum QuotationStatus {
    DRAFT = 'Draft',
    SENT = 'Sent',
    ACCEPTED = 'Accepted',
    REJECTED = 'Rejected',
    EXPIRED = 'Expired',
    REVISED = 'Revised',
    ARCHIVED = 'Archived',
}

@Entity('client_plan_quotations')
export class ClientPlanQuotation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'quotation_code', unique: true })
    quotationCode: string;

    @Column({ name: 'quoted_price', type: 'numeric', precision: 12, scale: 2, default: 0.00 })
    quotedPrice: number;

    @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
    status: QuotationStatus;

    @Column({ name: 'valid_until', type: 'timestamp', nullable: true })
    validUntil: Date;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Keys ---

    @Column({ name: 'client_id', type: 'uuid' })
    clientId: string;

    @Column({ name: 'development_plan_id', type: 'uuid' })
    developmentPlanId: string;

    // --- Relationships ---

    @ManyToOne(() => User, (user) => user.clientQuotations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: User;

    @ManyToOne(() => DevelopmentPlan, (plan) => plan.clientQuotations, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'development_plan_id' })
    developmentPlan: DevelopmentPlan;

    @OneToMany(() => Invoice, (invoice) => invoice.quotation)
    invoices: Invoice[];
}
