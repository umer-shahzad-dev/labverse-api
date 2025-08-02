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
import { ContactInquiriesService } from './contact-inquiries.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactInquiryDto } from './dto/update-contact-inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('contact-inquiries')
export class ContactInquiriesController {
    constructor(private readonly contactInquiriesService: ContactInquiriesService) { }

    @Post()
    create(@Body() createContactInquiryDto: CreateContactInquiryDto) {
        return this.contactInquiriesService.create(createContactInquiryDto);
    }

    // All other endpoints require authentication and permissions
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Get()
    @Permissions('manage_contact_inquiries')
    findAll() {
        return this.contactInquiriesService.findAll();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Get(':id')
    @Permissions('manage_contact_inquiries')
    findOne(@Param('id') id: string) {
        return this.contactInquiriesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Patch(':id')
    @Permissions('manage_contact_inquiries')
    update(
        @Param('id') id: string,
        @Body() updateContactInquiryDto: UpdateContactInquiryDto,
    ) {
        return this.contactInquiriesService.update(id, updateContactInquiryDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Delete(':id')
    @Permissions('manage_contact_inquiries')
    remove(@Param('id') id: string) {
        return this.contactInquiriesService.remove(id);
    }
}