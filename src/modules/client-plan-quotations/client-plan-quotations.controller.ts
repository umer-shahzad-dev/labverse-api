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
import { ClientPlanQuotationsService } from './client-plan-quotations.service';
import { CreateClientPlanQuotationDto } from './dto/create-client-plan-quotation.dto';
import { UpdateClientPlanQuotationDto } from './dto/update-client-plan-quotation.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { QuotationStatus } from './entities/client-plan-quotation.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

// DTO for updating only status
class UpdateQuotationStatusDto {
    @IsEnum(QuotationStatus)
    @IsNotEmpty()
    status: QuotationStatus;
}

@Controller('client-plan-quotations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClientPlanQuotationsController {
    constructor(private readonly clientPlanQuotationsService: ClientPlanQuotationsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_client_plan_quotation')
    create(@Body() createQuotationDto: CreateClientPlanQuotationDto) {
        return this.clientPlanQuotationsService.create(createQuotationDto);
    }

    @Get()
    @Permissions('read_client_plan_quotation')
    findAll() {
        return this.clientPlanQuotationsService.findAll();
    }

    @Get(':id')
    @Permissions('read_client_plan_quotation')
    findOne(@Param('id') id: string) {
        return this.clientPlanQuotationsService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_client_plan_quotation')
    update(@Param('id') id: string, @Body() updateQuotationDto: UpdateClientPlanQuotationDto) {
        return this.clientPlanQuotationsService.update(id, updateQuotationDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_client_plan_quotation')
    remove(@Param('id') id: string) {
        return this.clientPlanQuotationsService.remove(id);
    }

    // API for updating quotation status
    @Patch(':id/status')
    @Permissions('update_client_plan_quotation_status') // A specific permission for status updates
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateQuotationStatusDto) {
        return this.clientPlanQuotationsService.updateQuotationStatus(id, updateStatusDto.status);
    }
}