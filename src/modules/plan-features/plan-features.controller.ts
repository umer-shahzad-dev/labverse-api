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
    Put,
} from '@nestjs/common';
import { PlanFeaturesService } from './plan-features.service';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('plan-features')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlanFeaturesController {
    constructor(private readonly planFeaturesService: PlanFeaturesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_plan_feature')
    create(@Body() createPlanFeatureDto: CreatePlanFeatureDto) {
        return this.planFeaturesService.create(createPlanFeatureDto);
    }

    @Get()
    @Permissions('read_plan_feature')
    findAll() {
        return this.planFeaturesService.findAll();
    }

    @Get(':id')
    @Permissions('read_plan_feature')
    findOne(@Param('id') id: string) {
        return this.planFeaturesService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_plan_feature')
    update(@Param('id') id: string, @Body() updatePlanFeatureDto: UpdatePlanFeatureDto) {
        return this.planFeaturesService.update(id, updatePlanFeatureDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_plan_feature')
    remove(@Param('id') id: string) {
        return this.planFeaturesService.remove(id);
    }
}