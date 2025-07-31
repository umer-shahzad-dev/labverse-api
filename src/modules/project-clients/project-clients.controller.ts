import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProjectClientsService } from './project-clients.service';
import { CreateProjectClientDto } from './dto/create-project-client.dto';
import { UpdateProjectClientDto } from './dto/update-project-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('project-clients') // Base path for managing project-client associations
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_project_clients') // New permission
export class ProjectClientsController {
    constructor(private readonly projectClientsService: ProjectClientsService) { }

    @Post()
    create(@Body() createProjectClientDto: CreateProjectClientDto) {
        return this.projectClientsService.create(createProjectClientDto);
    }

    @Get()
    findAll() {
        return this.projectClientsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectClientsService.findOne(id);
    }

    // Optional: Get all clients for a specific project
    @Get('project/:projectId')
    findByProjectId(@Param('projectId') projectId: string) {
        return this.projectClientsService.findByProjectId(projectId);
    }

    // Optional: Get all projects for a specific client
    @Get('user/:userId')
    findByUserId(@Param('userId') userId: string) {
        return this.projectClientsService.findByUserId(userId);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateProjectClientDto: UpdateProjectClientDto) {
        return this.projectClientsService.update(id, updateProjectClientDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectClientsService.remove(id);
    }
}