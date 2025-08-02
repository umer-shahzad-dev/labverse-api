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
import { ClientInteractionsService } from './client-interactions.service';
import { CreateClientInteractionDto } from './dto/create-client-interaction.dto';
import { UpdateClientInteractionDto } from './dto/update-client-interaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('client-interactions')
export class ClientInteractionsController {
    constructor(private readonly clientInteractionsService: ClientInteractionsService) { }

    @Post()
    @Permissions('manage_client_interactions')
    create(
        @Body() createClientInteractionDto: CreateClientInteractionDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.clientInteractionsService.create(createClientInteractionDto, user.id);
    }

    @Get()
    @Permissions('manage_client_interactions')
    findAll() {
        return this.clientInteractionsService.findAll();
    }

    @Get(':id')
    @Permissions('manage_client_interactions')
    findOne(@Param('id') id: string) {
        return this.clientInteractionsService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_client_interactions')
    update(
        @Param('id') id: string,
        @Body() updateClientInteractionDto: UpdateClientInteractionDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.clientInteractionsService.update(id, updateClientInteractionDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_client_interactions')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.clientInteractionsService.remove(id, user.id);
    }
}