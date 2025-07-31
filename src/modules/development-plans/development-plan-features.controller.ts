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
import { DevelopmentPlanFeaturesService } from './development-plan-features.service';
import { CreateDevelopmentPlanFeatureDto } from './dto/create-development-plan-feature.dto';
import { UpdateDevelopmentPlanFeatureDto } from './dto/update-development-plan-feature.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('development-plan-features')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DevelopmentPlanFeaturesController {
    constructor(private readonly dpfService: DevelopmentPlanFeaturesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_development_plan_feature')
    create(@Body() createDpfDto: CreateDevelopmentPlanFeatureDto) {
        return this.dpfService.create(createDpfDto);
    }

    @Get()
    @Permissions('read_development_plan_feature')
    findAll() {
        return this.dpfService.findAll();
    }

    @Get(':id')
    @Permissions('read_development_plan_feature')
    findOne(@Param('id') id: string) {
        return this.dpfService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_development_plan_feature')
    update(@Param('id') id: string, @Body() updateDpfDto: UpdateDevelopmentPlanFeatureDto) {
        return this.dpfService.update(id, updateDpfDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_development_plan_feature')
    remove(@Param('id') id: string) {
        return this.dpfService.remove(id);
    }
}