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
import { DevelopmentPlanTechnologiesService } from './development-plan-technologies.service';
import { CreateDevelopmentPlanTechnologyDto } from './dto/create-development-plan-technology.dto';
import { UpdateDevelopmentPlanTechnologyDto } from './dto/update-development-plan-technology.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('development-plan-technologies')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DevelopmentPlanTechnologiesController {
    constructor(private readonly dptService: DevelopmentPlanTechnologiesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_development_plan_technology')
    create(@Body() createDptDto: CreateDevelopmentPlanTechnologyDto) {
        return this.dptService.create(createDptDto);
    }

    @Get()
    @Permissions('read_development_plan_technology')
    findAll() {
        return this.dptService.findAll();
    }

    @Get(':id')
    @Permissions('read_development_plan_technology')
    findOne(@Param('id') id: string) {
        return this.dptService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_development_plan_technology')
    update(@Param('id') id: string, @Body() updateDptDto: UpdateDevelopmentPlanTechnologyDto) {
        return this.dptService.update(id, updateDptDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_development_plan_technology')
    remove(@Param('id') id: string) {
        return this.dptService.remove(id);
    }
}