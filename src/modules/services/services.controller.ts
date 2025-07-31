import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Put, // Use Put for full updates, Patch for partial
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_service')
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Get()
    @Permissions('read_service')
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    @Permissions('read_service')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }

    @Put(':id') // Using PUT for comprehensive update
    @Permissions('update_service')
    update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_service')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}