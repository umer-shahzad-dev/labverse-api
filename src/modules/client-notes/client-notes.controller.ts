import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ClientNotesService } from './client-notes.service';
import { CreateClientNoteDto } from './dto/create-client-note.dto';
import { UpdateClientNoteDto } from './dto/update-client-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('client-notes')
export class ClientNotesController {
    constructor(private readonly clientNotesService: ClientNotesService) { }

    @Post()
    @Permissions('manage_client_notes')
    create(@Body() createClientNoteDto: CreateClientNoteDto, @Req() req: Request) {
        const user = req.user;
        return this.clientNotesService.create(createClientNoteDto, user.id);
    }

    @Get()
    @Permissions('manage_client_notes')
    findAll() {
        return this.clientNotesService.findAll();
    }

    @Get(':id')
    @Permissions('manage_client_notes')
    findOne(@Param('id') id: string) {
        return this.clientNotesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_client_notes')
    update(
        @Param('id') id: string,
        @Body() updateClientNoteDto: UpdateClientNoteDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.clientNotesService.update(id, updateClientNoteDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_client_notes')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.clientNotesService.remove(id, user.id);
    }
}