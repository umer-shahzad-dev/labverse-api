import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectUpdatesService } from './project-updates.service';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';
import { UpdateProjectUpdateDto } from './dto/update-project-update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('project-updates') // Base path for managing project updates
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_project_updates') // New permission
export class ProjectUpdatesController {
    constructor(private readonly projectUpdatesService: ProjectUpdatesService) { }

    @Post()
    create(@Body() createProjectUpdateDto: CreateProjectUpdateDto) {
        return this.projectUpdatesService.create(createProjectUpdateDto);
    }

    @Get()
    findAll() {
        return this.projectUpdatesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectUpdatesService.findOne(id);
    }

    // Get all updates for a specific project
    @Get('project/:projectId')
    findByProjectId(@Param('projectId') projectId: string) {
        return this.projectUpdatesService.findByProjectId(projectId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProjectUpdateDto: UpdateProjectUpdateDto) {
        return this.projectUpdatesService.update(id, updateProjectUpdateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectUpdatesService.remove(id);
    }
}