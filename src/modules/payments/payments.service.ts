import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'; // Removed OnModuleInit as it's not used in this snippet
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Invoice, InvoicePaymentStatus } from '../invoices/entities/invoice.entity';
import { InvoicesService } from '../invoices/invoices.service'; // Inject InvoicesService

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        private invoicesService: InvoicesService, // Inject InvoicesService
    ) { }

    // Helper method to update invoice's paid amount and status
    private async updateInvoicePaymentDetails(invoiceId: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${invoiceId}" not found during payment update.`);
        }

        const successfulPayments = await this.paymentRepository.find({
            where: { invoiceId, status: PaymentStatus.SUCCESSFUL },
        });

        // FIX: Ensure payment.amount is parsed to a float before summing
        // TypeORM usually handles numeric to number conversion, but in some cases,
        // or with high precision, it might return strings. parseFloat ensures correct math.
        const totalPaid = successfulPayments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);

        let newPaymentStatus: InvoicePaymentStatus;
        if (totalPaid >= invoice.totalAmount) {
            newPaymentStatus = InvoicePaymentStatus.PAID;
        } else if (totalPaid > 0) {
            newPaymentStatus = InvoicePaymentStatus.PARTIALLY_PAID;
        } else {
            newPaymentStatus = InvoicePaymentStatus.PENDING;
        }

        invoice.paidAmount = totalPaid;
        invoice.paymentStatus = newPaymentStatus;

        return this.invoiceRepository.save(invoice);
    }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const { invoiceId, amount, paymentDate, paymentMethod, transactionId, notes, status } = createPaymentDto;

        const invoice = await this.invoiceRepository.findOne({ where: { id: invoiceId } });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${invoiceId}" not found.`);
        }

        // Prevent adding payments to cancelled or already fully paid invoices (optional business logic)
        if (invoice.paymentStatus === InvoicePaymentStatus.CANCELLED) {
            throw new BadRequestException(`Cannot add payment to a cancelled invoice.`);
        }
        if (invoice.paymentStatus === InvoicePaymentStatus.PAID && amount > 0) {
            throw new BadRequestException(`Invoice with ID "${invoiceId}" is already fully paid.`);
        }

        const payment = this.paymentRepository.create({
            invoice,
            invoiceId,
            amount,
            paymentDate: new Date(paymentDate),
            paymentMethod: paymentMethod || PaymentMethod.BANK_TRANSFER,
            transactionId,
            notes,
            status: status || PaymentStatus.SUCCESSFUL,
        });

        const savedPayment = await this.paymentRepository.save(payment);

        // Update the associated invoice's payment details
        await this.updateInvoicePaymentDetails(invoiceId);

        return savedPayment;
    }

    async findAll(): Promise<Payment[]> {
        return this.paymentRepository.find({
            relations: ['invoice'],
            order: { paymentDate: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['invoice'],
        });
        if (!payment) {
            throw new NotFoundException(`Payment with ID "${id}" not found.`);
        }
        return payment;
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
            throw new NotFoundException(`Payment with ID "${id}" not found.`);
        }

        // Capture old invoiceId if it changes, for re-calculating totals
        const oldInvoiceId = payment.invoiceId;

        // Update payment fields
        Object.assign(payment, updatePaymentDto);
        if (updatePaymentDto.paymentDate) {
            payment.paymentDate = new Date(updatePaymentDto.paymentDate);
        }

        const updatedPayment = await this.paymentRepository.save(payment);

        // Update old invoice if payment moved to a new invoice
        if (oldInvoiceId !== updatedPayment.invoiceId) {
            await this.updateInvoicePaymentDetails(oldInvoiceId);
        }
        // Update the current/new invoice
        await this.updateInvoicePaymentDetails(updatedPayment.invoiceId);

        return updatedPayment;
    }

    async remove(id: string): Promise<void> {
        const payment = await this.paymentRepository.findOne({ where: { id } });
        if (!payment) {
            throw new NotFoundException(`Payment with ID "${id}" not found.`);
        }

        const invoiceId = payment.invoiceId;
        const result = await this.paymentRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Payment with ID "${id}" not found.`);
        }

        // Re-calculate and update the associated invoice's payment details
        await this.updateInvoicePaymentDetails(invoiceId);
    }
}