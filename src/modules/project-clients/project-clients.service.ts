import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectClient } from './entities/project-client.entity';
import { CreateProjectClientDto } from './dto/create-project-client.dto';
import { UpdateProjectClientDto } from './dto/update-project-client.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectClientsService {
    constructor(
        @InjectRepository(ProjectClient)
        private readonly projectClientRepository: Repository<ProjectClient>, // This is private
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto: CreateProjectClientDto): Promise<ProjectClient> {
        const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${dto.projectId}" not found.`);
        }

        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${dto.userId}" not found.`);
        }

        // Check if the user is already a client of this project
        const existingAssignment = await this.projectClientRepository.findOne({
            where: {
                project: { id: dto.projectId },
                user: { id: dto.userId },
            },
        });

        if (existingAssignment) {
            throw new ConflictException(`User with ID "${dto.userId}" is already a client of Project with ID "${dto.projectId}".`);
        }

        const projectClient = this.projectClientRepository.create({
            ...dto,
            project,
            user,
            assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : undefined,
        });

        return this.projectClientRepository.save(projectClient);
    }

    async findAll(): Promise<ProjectClient[]> {
        return this.projectClientRepository.find({
            relations: ['project', 'user'],
        });
    }

    async findOne(id: string): Promise<ProjectClient> {
        const projectClient = await this.projectClientRepository.findOne({
            where: { id },
            relations: ['project', 'user'],
        });
        if (!projectClient) {
            throw new NotFoundException(`Project Client assignment with ID "${id}" not found.`);
        }
        return projectClient;
    }

    async findByProjectId(projectId: string): Promise<ProjectClient[]> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
        return this.projectClientRepository.find({
            where: { project: { id: projectId } },
            relations: ['user', 'project'],
        });
    }

    async findByUserId(userId: string): Promise<ProjectClient[]> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${userId}" not found.`);
        }
        return this.projectClientRepository.find({
            where: { user: { id: userId } },
            relations: ['project', 'user'],
        });
    }

    async update(id: string, dto: UpdateProjectClientDto): Promise<ProjectClient> {
        const projectClient = await this.findOne(id);

        const { projectId, userId, assignedAt, ...rest } = dto;

        Object.assign(projectClient, rest);

        if (assignedAt !== undefined) {
            projectClient.assignedAt = assignedAt ? new Date(assignedAt) : null;
        }

        return this.projectClientRepository.save(projectClient);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectClientRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project Client assignment with ID "${id}" not found.`);
        }
    }

    /**
     * Checks if a specific user is assigned as a client to a specific project.
     * @param projectId The ID of the project.
     * @param userId The ID of the user (client).
     * @returns A boolean indicating if the assignment exists.
     */
    async isClientOfProject(projectId: string, userId: string): Promise<boolean> {
        const assignment = await this.projectClientRepository.findOne({
            where: {
                projectId: projectId,
                userId: userId,
            },
        });
        return !!assignment; // Returns true if assignment exists, false otherwise
    }
}