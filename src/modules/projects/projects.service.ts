import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'; // 👈 Add ConflictException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>, // Renamed for consistency
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
        // Use createProjectDto.createdById as per our DTOs
        if (createProjectDto.createdById) {
            createdBy = await this.userRepository.findOne({ where: { id: createProjectDto.createdById } });
            if (!createdBy) {
                throw new NotFoundException(`User with ID "${createProjectDto.createdById}" not found.`);
            }
        }

        const project = this.projectRepository.create({
            ...createProjectDto,
            createdBy,
            // Ensure date handling for nulls is consistent if the DTO allows null
            startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : null,
            endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : null,
        });
        return this.projectRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.projectRepository.find({
            relations: [
                'createdBy',         // Include the user who created the project
                'members',           // Include project members (ProjectMember entity)
                'members.user',      // Include user details within each ProjectMember
                'technologies',      // Include project technologies (ProjectTechnology entity)
                'technologies.technology', // Include technology details within each ProjectTechnology
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
        const project = await this.findOne(id); // Ensures the project exists and loads relations

        // Check for duplicate name during update, excluding the current project itself
        if (updateProjectDto.name && updateProjectDto.name !== project.name) {
            const existingProject = await this.projectRepository.findOne({
                where: { name: updateProjectDto.name },
            });
            if (existingProject && existingProject.id !== id) {
                throw new ConflictException(`Project with name "${updateProjectDto.name}" already exists.`);
            }
        }

        // Update createdBy if provided (optional)
        // Use updateProjectDto.createdById as per our DTOs
        if (updateProjectDto.createdById) {
            const newCreator = await this.userRepository.findOne({ where: { id: updateProjectDto.createdById } });
            if (!newCreator) {
                throw new NotFoundException(`User with ID "${updateProjectDto.createdById}" not found.`);
            }
            project.createdBy = newCreator;
        } else if (updateProjectDto.createdById === null) {
            // If createdById is explicitly null, set createdBy to null
            project.createdBy = null;
        }


        // Convert and assign date strings to Date objects if they exist in the DTO
        if (updateProjectDto.startDate !== undefined) {
            project.startDate = updateProjectDto.startDate ? new Date(updateProjectDto.startDate) : null;
        }
        if (updateProjectDto.endDate !== undefined) {
            project.endDate = updateProjectDto.endDate ? new Date(updateProjectDto.endDate) : null;
        }

        // Destructure DTO to exclude relations or IDs handled separately
        const { createdById, startDate, endDate, ...projectData } = updateProjectDto;

        // Assign other properties
        Object.assign(project, projectData);

        return this.projectRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}