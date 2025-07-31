import { Module } from '@nestjs/common';
import { ClientProjectsController } from './client-projects.controller';
import { ProjectsModule } from '../projects/projects.module'; // Import ProjectsModule
import { ProjectClientsModule } from '../project-clients/project-clients.module'; // Import ProjectClientsModule
import { ProjectMilestonesModule } from '../project-milestones/project-milestones.module'; // Import ProjectMilestonesModule
import { ProjectUpdatesModule } from '../project-updates/project-updates.module'; // Import ProjectUpdatesModule
import { AuthModule } from '../auth/auth.module'; // Needed for JwtAuthGuard

@Module({
    imports: [
        ProjectsModule,          // To get project details
        ProjectClientsModule,    // To verify client-project association
        ProjectMilestonesModule, // To get project milestones
        ProjectUpdatesModule,    // To get project updates
        AuthModule,              // For JwtAuthGuard
    ],
    controllers: [ClientProjectsController],
    providers: [], // No specific services for ClientProjectsModule itself, it uses others
})
export class ClientProjectsModule { }