import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectTechnologiesService } from './project-technologies.service';
import { CreateProjectTechnologyDto } from './dto/create-project-technology.dto';
import { UpdateProjectTechnologyDto } from './dto/update-project-technology.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('project-technologies') // Base path for managing project-technology associations
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_project_technologies') // New permission
export class ProjectTechnologiesController {
    constructor(private readonly projectTechnologiesService: ProjectTechnologiesService) { }

    @Post()
    create(@Body() createProjectTechnologyDto: CreateProjectTechnologyDto) {
        return this.projectTechnologiesService.create(createProjectTechnologyDto);
    }

    @Get()
    findAll() {
        return this.projectTechnologiesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectTechnologiesService.findOne(id);
    }

    // Optional: Get all technologies for a specific project
    @Get('project/:projectId')
    findByProjectId(@Param('projectId') projectId: string) {
        return this.projectTechnologiesService.findByProjectId(projectId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProjectTechnologyDto: UpdateProjectTechnologyDto) {
        return this.projectTechnologiesService.update(id, updateProjectTechnologyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectTechnologiesService.remove(id);
    }
}