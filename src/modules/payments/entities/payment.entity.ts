import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

// Enum for Payment Method
export enum PaymentMethod {
    BANK_TRANSFER = 'Bank Transfer',
    CREDIT_CARD = 'Credit Card',
    DEBIT_CARD = 'Debit Card',
    CASH = 'Cash',
    ONLINE_GATEWAY = 'Online Gateway',
    CHEQUE = 'Cheque',
    OTHER = 'Other',
}

// Enum for Payment Status
export enum PaymentStatus {
    SUCCESSFUL = 'Successful',
    PENDING = 'Pending',
    FAILED = 'Failed',
    REFUNDED = 'Refunded',
    CANCELLED = 'Cancelled',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column({ name: 'payment_date', type: 'date' })
    paymentDate: Date;

    @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod, default: PaymentMethod.BANK_TRANSFER })
    paymentMethod: PaymentMethod;

    @Column({ name: 'transaction_id', type: 'text', nullable: true })
    transactionId: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.SUCCESSFUL })
    status: PaymentStatus;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // --- Foreign Key ---
    @Column({ name: 'invoice_id', type: 'uuid' })
    invoiceId: string;

    // --- Relationship ---
    @ManyToOne(() => Invoice, (invoice) => invoice.payments, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'invoice_id' })
    invoice: Invoice;
}
