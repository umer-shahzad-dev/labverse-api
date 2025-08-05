import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service'; // <-- New Import

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly notificationsService: NotificationsService, // <-- Inject the service
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        // Check for duplicate project name
        const existingProject = await this.projectRepository.findOne({
            where: { name: createProjectDto.name },
        });
        if (existingProject) {
            throw new ConflictException(`Project with name "${createProjectDto.name}" already exists.`);
        }

        let createdBy: User;
        if (createProjectDto.createdById) {
            createdBy = await this.userRepository.findOne({ where: { id: createProjectDto.createdById } });
            if (!createdBy) {
                throw new NotFoundException(`User with ID "${createProjectDto.createdById}" not found.`);
            }
        }

        const project = this.projectRepository.create({
            ...createProjectDto,
            createdBy,
            startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : null,
            endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
        });
        const savedProject = await this.projectRepository.save(project);

        // Create a notification for the project creator
        if (createdBy) {
            await this.notificationsService.create({
                userId: createdBy.id,
                message: `Project "${savedProject.name}" has been created.`,
            });
        }

        return savedProject;
    }

    async findAll(): Promise<Project[]> {
        return this.projectRepository.find({
            relations: [
                'createdBy',
                'members',
                'members.user',
                'technologies',
                'technologies.technology',
            ],
        });
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: [
                'createdBy',
                'members',
                'members.user',
                'technologies',
                'technologies.technology',
            ],
        });
        if (!project) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.findOne(id);

        // Check for duplicate name during update
        if (updateProjectDto.name && updateProjectDto.name !== project.name) {
            const existingProject = await this.projectRepository.findOne({
                where: { name: updateProjectDto.name },
            });
            if (existingProject && existingProject.id !== id) {
                throw new ConflictException(`Project with name "${updateProjectDto.name}" already exists.`);
            }
        }

        let newCreator: User = project.createdBy;
        if (updateProjectDto.createdById) {
            newCreator = await this.userRepository.findOne({ where: { id: updateProjectDto.createdById } });
            if (!newCreator) {
                throw new NotFoundException(`User with ID "${updateProjectDto.createdById}" not found.`);
            }
        } else if (updateProjectDto.createdById === null) {
            newCreator = null;
        }

        if (updateProjectDto.startDate !== undefined) {
            project.startDate = updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : null;
        }
        if (updateProjectDto.endDate !== undefined) {
            project.endDate = updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : null;
        }

        const { createdById, startDate, endDate, ...projectData } = updateProjectDto;
        Object.assign(project, { ...projectData, createdBy: newCreator });

        const updatedProject = await this.projectRepository.save(project);

        // Create a notification for the project creator
        if (updatedProject.createdBy) {
            await this.notificationsService.create({
                userId: updatedProject.createdBy.id,
                message: `Project "${updatedProject.name}" has been updated.`,
            });
        }

        return updatedProject;
    }

    async remove(id: string): Promise<void> {
        const projectToRemove = await this.findOne(id); // Find the project to get its creator
        const result = await this.projectRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }

        // Create a notification for the project creator after deletion
        if (projectToRemove.createdBy) {
            await this.notificationsService.create({
                userId: projectToRemove.createdBy.id,
                message: `Project "${projectToRemove.name}" has been deleted.`,
            });
        }
    }
}
