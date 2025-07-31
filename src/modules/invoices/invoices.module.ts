import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { User } from '../users/entities/user.entity'; // For client relationship
import { ClientPlanQuotation } from '../client-plan-quotations/entities/client-plan-quotation.entity'; // For quotation relationship

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Invoice,
            InvoiceItem,
            User, // Register User for InvoicesService
            ClientPlanQuotation, // Register ClientPlanQuotation for InvoicesService
        ]),
    ],
    controllers: [InvoicesController],
    providers: [InvoicesService],
    exports: [InvoicesService],
})
export class InvoicesModule { }