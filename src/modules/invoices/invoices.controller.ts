import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Put,
    Patch,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { InvoicePaymentStatus } from './entities/invoice.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

// DTO for updating only payment status
class UpdateInvoicePaymentStatusDto {
    @IsEnum(InvoicePaymentStatus)
    @IsNotEmpty()
    status: InvoicePaymentStatus;
}

@Controller('invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_invoice')
    create(@Body() createInvoiceDto: CreateInvoiceDto) {
        return this.invoicesService.create(createInvoiceDto);
    }

    @Get()
    @Permissions('read_invoice')
    findAll() {
        return this.invoicesService.findAll();
    }

    @Get(':id')
    @Permissions('read_invoice')
    findOne(@Param('id') id: string) {
        return this.invoicesService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_invoice')
    update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
        return this.invoicesService.update(id, updateInvoiceDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_invoice')
    remove(@Param('id') id: string) {
        return this.invoicesService.remove(id);
    }

    // API for updating invoice payment status
    @Patch(':id/status')
    @Permissions('update_invoice_payment_status') // Specific permission for status updates
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateInvoicePaymentStatusDto) {
        return this.invoicesService.updateInvoicePaymentStatus(id, updateStatusDto.status);
    }
}