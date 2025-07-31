import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ClientPlanQuotation } from '../../client-plan-quotations/entities/client-plan-quotation.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum InvoicePaymentStatus {
    PENDING = 'Pending',
    PARTIALLY_PAID = 'Partially Paid',
    PAID = 'Paid',
    OVERDUE = 'Overdue',
    CANCELLED = 'Cancelled',
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'invoice_number', unique: true })
    invoiceNumber: string;

    @Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2, default: 0.00 })
    totalAmount: number;

    @Column({ name: 'issue_date', type: 'date' })
    issueDate: Date;

    @Column({ name: 'due_date', type: 'date' })
    dueDate: Date;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: InvoicePaymentStatus,
        default: InvoicePaymentStatus.PENDING,
    })
    paymentStatus: InvoicePaymentStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'paid_amount', type: 'numeric', precision: 12, scale: 2, default: 0.00 })
    paidAmount: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Keys ---

    @Column({ name: 'client_id', type: 'uuid' })
    clientId: string;

    @Column({ name: 'quotation_id', type: 'uuid', nullable: true })
    quotationId: string;

    // --- Relationships ---

    @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'client_id' })
    client: User;

    @ManyToOne(() => ClientPlanQuotation, (quote) => quote.invoices, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn({ name: 'quotation_id' })
    quotation: ClientPlanQuotation;

    @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
    invoiceItems: InvoiceItem[];

    @OneToMany(() => Payment, (payment) => payment.invoice)
    payments: Payment[];

}
