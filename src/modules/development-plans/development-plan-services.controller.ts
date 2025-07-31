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
} from '@nestjs/common';
import { DevelopmentPlanServicesService } from './development-plan-services.service';
import { CreateDevelopmentPlanServiceDto } from './dto/create-development-plan-service.dto';
import { UpdateDevelopmentPlanServiceDto } from './dto/update-development-plan-service.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('development-plan-services')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DevelopmentPlanServicesController {
    constructor(private readonly dpsService: DevelopmentPlanServicesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_development_plan_service')
    create(@Body() createDpsDto: CreateDevelopmentPlanServiceDto) {
        return this.dpsService.create(createDpsDto);
    }

    @Get()
    @Permissions('read_development_plan_service')
    findAll() {
        return this.dpsService.findAll();
    }

    @Get(':id')
    @Permissions('read_development_plan_service')
    findOne(@Param('id') id: string) {
        return this.dpsService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_development_plan_service')
    update(@Param('id') id: string, @Body() updateDpsDto: UpdateDevelopmentPlanServiceDto) {
        return this.dpsService.update(id, updateDpsDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_development_plan_service')
    remove(@Param('id') id: string) {
        return this.dpsService.remove(id);
    }
}