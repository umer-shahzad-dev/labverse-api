import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { Invoice } from '../invoices/entities/invoice.entity'; // For invoice relationship and update
import { InvoicesService } from '../invoices/invoices.service'; // For injecting InvoicesService to update invoices
import { InvoiceItem } from '../invoices/entities/invoice-item.entity'; // Also needed by InvoicesService
import { User } from '../users/entities/user.entity'; // Also needed by InvoicesService
import { ClientPlanQuotation } from '../client-plan-quotations/entities/client-plan-quotation.entity'; // Also needed by InvoicesService

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Payment,
            Invoice, // Register Invoice here because PaymentsService needs its repository
            InvoiceItem, // InvoicesService also needs this, so register it if it's not global
            User, // InvoicesService needs this
            ClientPlanQuotation, // InvoicesService needs this
        ]),
    ],
    controllers: [PaymentsController],
    providers: [
        PaymentsService,
        InvoicesService, // Provide InvoicesService as it's used for updating invoice status/paid amount
    ],
    exports: [PaymentsService],
})
export class PaymentsModule { }