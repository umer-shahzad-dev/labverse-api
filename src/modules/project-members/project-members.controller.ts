import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('project-members') // Base path for project member management
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_project_members') // New permission for managing project members
export class ProjectMembersController {
    constructor(private readonly projectMembersService: ProjectMembersService) { }

    @Post()
    create(@Body() createProjectMemberDto: CreateProjectMemberDto) {
        return this.projectMembersService.create(createProjectMemberDto);
    }

    @Get()
    findAll() {
        return this.projectMembersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectMembersService.findOne(id);
    }

    // Optional: Get all members for a specific project
    @Get('project/:projectId')
    findByProjectId(@Param('projectId') projectId: string) {
        return this.projectMembersService.findByProjectId(projectId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProjectMemberDto: UpdateProjectMemberDto) {
        return this.projectMembersService.update(id, updateProjectMemberDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectMembersService.remove(id);
    }
}