import { Controller, Get, Param, UseGuards, Request, NotFoundException, ForbiddenException } from '@nestjs/common'; // Import ForbiddenException
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { ProjectClientsService } from '../project-clients/project-clients.service';
import { ProjectsService } from '../projects/projects.service';
import { ProjectMilestonesService } from '../project-milestones/project-milestones.service';
import { ProjectUpdatesService } from '../project-updates/project-updates.service';

@Controller('client/projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('view_client_projects')
export class ClientProjectsController {
    constructor(
        private readonly projectClientsService: ProjectClientsService,
        private readonly projectsService: ProjectsService,
        private readonly projectMilestonesService: ProjectMilestonesService,
        private readonly projectUpdatesService: ProjectUpdatesService,
    ) { }

    @Get()
    async getMyProjects(@Request() req) {
        const userId = req.user.id;

        const clientProjects = await this.projectClientsService.findByUserId(userId);
        const projectIds = clientProjects.map(pc => pc.projectId);

        if (projectIds.length === 0) {
            return [];
        }

        // A more efficient way would be to add a `findByIds` or `findByProjectIds` method to ProjectsService
        // For now, let's filter after fetching, but be aware of performance for many projects
        const allProjects = await this.projectsService.findAll(); // This fetches ALL projects
        const myProjects = allProjects.filter(p => projectIds.includes(p.id));

        return myProjects;
    }

    @Get(':projectId')
    async getProjectDetails(
        @Param('projectId') projectId: string,
        @Request() req
    ) {
        const userId = req.user.id;

        // 1. Verify if the authenticated user is a client for this project using the service method
        const hasAccess = await this.projectClientsService.isClientOfProject(projectId, userId);

        if (!hasAccess) {
            throw new ForbiddenException(`You do not have access to project with ID "${projectId}".`); // Changed to Forbidden
        }

        // 2. Fetch project details
        const project = await this.projectsService.findOne(projectId);
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }

        // 3. Fetch milestones and updates for this project
        const milestones = await this.projectMilestonesService.findByProjectId(projectId);
        const updates = await this.projectUpdatesService.findByProjectId(projectId);

        // 4. Combine and return the data
        return {
            ...project,
            milestones,
            updates,
        };
    }
}