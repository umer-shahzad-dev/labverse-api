import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    @Permissions('manage_leads')
    create(@Body() createLeadDto: CreateLeadDto) {
        return this.leadsService.create(createLeadDto);
    }

    @Get()
    @Permissions('manage_leads')
    findAll() {
        return this.leadsService.findAll();
    }

    @Get(':id')
    @Permissions('manage_leads')
    findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_leads')
    update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
        return this.leadsService.update(id, updateLeadDto);
    }

    @Delete(':id')
    @Permissions('manage_leads')
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }
}