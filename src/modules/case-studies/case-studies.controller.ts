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
import { CaseStudiesService } from './case-studies.service';
import { CreateCaseStudyDto } from './dto/create-case-study.dto';
import { UpdateCaseStudyDto } from './dto/update-case-study.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('case-studies')
export class CaseStudiesController {
    constructor(private readonly caseStudiesService: CaseStudiesService) { }

    @Post()
    @Permissions('manage_case_studies')
    create(@Body() createCaseStudyDto: CreateCaseStudyDto, @Req() req: Request) {
        const user = req.user;
        return this.caseStudiesService.create(createCaseStudyDto, user.id);
    }

    @Get()
    @Permissions('manage_case_studies')
    findAll() {
        return this.caseStudiesService.findAll();
    }

    @Get(':id')
    @Permissions('manage_case_studies')
    findOne(@Param('id') id: string) {
        return this.caseStudiesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('manage_case_studies')
    update(
        @Param('id') id: string,
        @Body() updateCaseStudyDto: UpdateCaseStudyDto,
        @Req() req: Request,
    ) {
        const user = req.user;
        return this.caseStudiesService.update(id, updateCaseStudyDto, user.id);
    }

    @Delete(':id')
    @Permissions('manage_case_studies')
    remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user;
        return this.caseStudiesService.remove(id, user.id);
    }
}