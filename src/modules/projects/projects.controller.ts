import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Patch, // <-- Corrected import to use Patch
    Delete,
    UseGuards,
    Req, // <-- New Import
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuditLogsService } from '../audit-logs/audit-logs.service'; // <-- New Import

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly auditLogsService: AuditLogsService, // <-- Inject the service
    ) { }

    @Post()
    async create(@Body() createProjectDto: CreateProjectDto, @Req() req: any) {
        const project = await this.projectsService.create(createProjectDto);

        await this.auditLogsService.create(
            {
                action: 'project.create',
                entityName: 'Project',
                entityId: project.id,
                details: { projectName: project.name },
            },
            req.user,
        );

        return project;
    }

    @Get()
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id') // <-- Changed from @Put to @Patch for consistency
    async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req: any) {
        const updatedProject = await this.projectsService.update(id, updateProjectDto);

        await this.auditLogsService.create(
            {
                action: 'project.update',
                entityName: 'Project',
                entityId: updatedProject.id,
                details: { updates: updateProjectDto },
            },
            req.user,
        );

        return updatedProject;
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: any) {
        const projectToRemove = await this.projectsService.findOne(id);
        await this.projectsService.remove(id);

        await this.auditLogsService.create(
            {
                action: 'project.delete',
                entityName: 'Project',
                entityId: projectToRemove.id,
                details: { projectName: projectToRemove.name },
            },
            req.user,
        );

        return { message: 'Project removed successfully' };
    }
}
