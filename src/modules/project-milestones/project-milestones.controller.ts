import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectMilestonesService } from './project-milestones.service';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('project-milestones') // Base path for managing project milestones
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_project_milestones') // New permission
export class ProjectMilestonesController {
    constructor(private readonly projectMilestonesService: ProjectMilestonesService) { }

    @Post()
    create(@Body() createProjectMilestoneDto: CreateProjectMilestoneDto) {
        return this.projectMilestonesService.create(createProjectMilestoneDto);
    }

    @Get()
    findAll() {
        return this.projectMilestonesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectMilestonesService.findOne(id);
    }

    // Get all milestones for a specific project
    @Get('project/:projectId')
    findByProjectId(@Param('projectId') projectId: string) {
        return this.projectMilestonesService.findByProjectId(projectId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProjectMilestoneDto: UpdateProjectMilestoneDto) {
        return this.projectMilestonesService.update(id, updateProjectMilestoneDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectMilestonesService.remove(id);
    }
}