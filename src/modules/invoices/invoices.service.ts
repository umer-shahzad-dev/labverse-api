import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoicePaymentStatus } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { User } from './../users/entities/user.entity';
import { ClientPlanQuotation, QuotationStatus } from './../client-plan-quotations/entities/client-plan-quotation.entity';

@Injectable()
export class InvoicesService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        @InjectRepository(InvoiceItem)
        private invoiceItemRepository: Repository<InvoiceItem>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(ClientPlanQuotation)
        private quotationRepository: Repository<ClientPlanQuotation>,
    ) { }

    private async generateInvoiceNumber(): Promise<string> {
        let invoiceNumber: string;
        let isUnique = false;
        do {
            // Simple sequential number or based on date
            const datePart = new Date().getFullYear().toString().slice(-2); // Last two digits of year
            const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random chars
            invoiceNumber = `INV-${datePart}-${randomPart}`;
            const existing = await this.invoiceRepository.findOne({ where: { invoiceNumber } });
            isUnique = !existing;
        } while (!isUnique);
        return invoiceNumber;
    }

    private calculateInvoiceTotal(items: InvoiceItem[]): number {
        return items.reduce((sum, item) => sum + item.total, 0);
    }

    async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        const { clientId, quotationId, issueDate, dueDate, paymentStatus, notes, items } = createInvoiceDto;

        const client = await this.userRepository.findOne({ where: { id: clientId } });
        if (!client) {
            throw new NotFoundException(`Client (User) with ID "${clientId}" not found.`);
        }

        let quotation: ClientPlanQuotation | null = null;
        if (quotationId) {
            quotation = await this.quotationRepository.findOne({ where: { id: quotationId } });
            if (!quotation) {
                throw new NotFoundException(`Quotation with ID "${quotationId}" not found.`);
            }
            // Optional: Add logic to check if quotation status is 'Accepted' or similar before invoicing
            // CORRECTED LINE BELOW:
            if (quotation.status !== QuotationStatus.ACCEPTED) { // Only allow invoicing if quotation is ACCEPTED
                // You can throw an error here if you want to strictly enforce this business rule
                // throw new BadRequestException(`Cannot create an invoice from a quotation with status "${quotation.status}". Only 'Accepted' quotations can be invoiced.`);
            }
        }

        const invoiceNumber = await this.generateInvoiceNumber();

        const invoiceItems = items.map(itemDto => {
            const item = this.invoiceItemRepository.create(itemDto);
            item.total = item.quantity * item.unitPrice;
            return item;
        });

        const totalAmount = this.calculateInvoiceTotal(invoiceItems);

        const invoice = this.invoiceRepository.create({
            client,
            quotation,
            clientId,
            quotationId,
            invoiceNumber,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            paymentStatus: paymentStatus || InvoicePaymentStatus.PENDING,
            totalAmount,
            notes,
            invoiceItems, // Assign items to the invoice
        });

        return this.invoiceRepository.save(invoice);
    }

    async findAll(): Promise<Invoice[]> {
        return this.invoiceRepository.find({
            relations: ['client', 'quotation', 'invoiceItems'],
            order: { issueDate: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['client', 'quotation', 'invoiceItems'],
        });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found.`);
        }
        return invoice;
    }

    async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({
            where: { id },
            relations: ['invoiceItems'], // Load items to handle updates
        });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found.`);
        }

        // Prevent updates if invoice is already paid or cancelled (business logic example)
        if ([InvoicePaymentStatus.PAID, InvoicePaymentStatus.CANCELLED].includes(invoice.paymentStatus)) {
            throw new BadRequestException(`Cannot update an invoice with status "${invoice.paymentStatus}".`);
        }

        // Handle client and quotation updates if provided
        if (updateInvoiceDto.clientId && updateInvoiceDto.clientId !== invoice.clientId) {
            const newClient = await this.userRepository.findOne({ where: { id: updateInvoiceDto.clientId } });
            if (!newClient) throw new NotFoundException(`Client (User) with ID "${updateInvoiceDto.clientId}" not found.`);
            invoice.client = newClient;
            invoice.clientId = updateInvoiceDto.clientId;
        }

        if (updateInvoiceDto.quotationId !== undefined) {
            if (updateInvoiceDto.quotationId === null) {
                invoice.quotation = null;
                invoice.quotationId = null;
            } else if (updateInvoiceDto.quotationId !== invoice.quotationId) {
                const newQuotation = await this.quotationRepository.findOne({ where: { id: updateInvoiceDto.quotationId } });
                if (!newQuotation) throw new NotFoundException(`Quotation with ID "${updateInvoiceDto.quotationId}" not found.`);
                invoice.quotation = newQuotation;
                invoice.quotationId = updateInvoiceDto.quotationId;
            }
        }

        // Update basic fields
        if (updateInvoiceDto.issueDate !== undefined) invoice.issueDate = new Date(updateInvoiceDto.issueDate);
        if (updateInvoiceDto.dueDate !== undefined) invoice.dueDate = new Date(updateInvoiceDto.dueDate);
        if (updateInvoiceDto.paymentStatus !== undefined) invoice.paymentStatus = updateInvoiceDto.paymentStatus;
        if (updateInvoiceDto.notes !== undefined) invoice.notes = updateInvoiceDto.notes;

        // Handle invoice items update
        if (updateInvoiceDto.items !== undefined) {
            // For simplicity, we'll remove existing items and re-create them.
            // For more robust update, you'd iterate, update existing, add new, remove missing.
            await this.invoiceItemRepository.remove(invoice.invoiceItems); // Remove old items
            const newInvoiceItems = updateInvoiceDto.items.map(itemDto => {
                const item = this.invoiceItemRepository.create(itemDto);
                item.total = item.quantity * item.unitPrice;
                return item;
            });
            invoice.invoiceItems = newInvoiceItems;
            invoice.totalAmount = this.calculateInvoiceTotal(newInvoiceItems);
        } else {
            // If items are not provided in update, ensure total is still correct if other fields change
            // (This would only apply if quantity/unitPrice were direct invoice fields, not items)
            invoice.totalAmount = this.calculateInvoiceTotal(invoice.invoiceItems); // Recalculate based on current items
        }

        return this.invoiceRepository.save(invoice);
    }

    async remove(id: string): Promise<void> {
        // If you need to check payment status before deletion, add logic here
        const result = await this.invoiceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Invoice with ID "${id}" not found.`);
        }
    }

    // API for tracking payment status (as per milestone)
    async updateInvoicePaymentStatus(id: string, newStatus: InvoicePaymentStatus): Promise<Invoice> {
        const invoice = await this.invoiceRepository.findOne({ where: { id } });
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found.`);
        }

        // Add business logic for status transitions (e.g., cannot go from Paid to Pending)
        if (invoice.paymentStatus === InvoicePaymentStatus.PAID && newStatus !== InvoicePaymentStatus.PAID) {
            throw new BadRequestException('Cannot change status from PAID to any other status.');
        }
        if (invoice.paymentStatus === InvoicePaymentStatus.CANCELLED && newStatus !== InvoicePaymentStatus.CANCELLED) {
            throw new BadRequestException('Cannot reactivate a CANCELLED invoice.');
        }

        invoice.paymentStatus = newStatus;
        return this.invoiceRepository.save(invoice);
    }
}