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
import { DevelopmentPlansService } from './development-plans.service';
import { CreateDevelopmentPlanDto } from './dto/create-development-plan.dto';
import { UpdateDevelopmentPlanDto } from './dto/update-development-plan.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('development-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DevelopmentPlansController {
    constructor(private readonly developmentPlansService: DevelopmentPlansService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_development_plan')
    create(@Body() createDevelopmentPlanDto: CreateDevelopmentPlanDto) {
        return this.developmentPlansService.create(createDevelopmentPlanDto);
    }

    @Get()
    @Permissions('read_development_plan')
    findAll() {
        return this.developmentPlansService.findAll();
    }

    @Get(':id')
    @Permissions('read_development_plan')
    findOne(@Param('id') id: string) {
        return this.developmentPlansService.findOne(id);
    }

    @Put(':id')
    @Permissions('update_development_plan')
    update(@Param('id') id: string, @Body() updateDevelopmentPlanDto: UpdateDevelopmentPlanDto) {
        return this.developmentPlansService.update(id, updateDevelopmentPlanDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_development_plan')
    remove(@Param('id') id: string) {
        return this.developmentPlansService.remove(id);
    }
}