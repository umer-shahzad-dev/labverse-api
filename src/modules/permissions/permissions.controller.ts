import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(id, updatePermissionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(id);
    }
}