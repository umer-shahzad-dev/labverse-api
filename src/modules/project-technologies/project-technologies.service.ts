import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTechnology } from './entities/project-technology.entity';
import { CreateProjectTechnologyDto } from './dto/create-project-technology.dto';
import { UpdateProjectTechnologyDto } from './dto/update-project-technology.dto';
import { Project } from '../projects/entities/project.entity';
import { Technology } from '../technologies/entities/technology.entity';

@Injectable()
export class ProjectTechnologiesService {
    constructor(
        @InjectRepository(ProjectTechnology)
        private readonly projectTechnologyRepository: Repository<ProjectTechnology>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(Technology)
        private readonly technologyRepository: Repository<Technology>,
    ) { }

    async create(dto: CreateProjectTechnologyDto): Promise<ProjectTechnology> {
        const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${dto.projectId}" not found.`);
        }

        const technology = await this.technologyRepository.findOne({ where: { id: dto.technologyId } });
        if (!technology) {
            throw new NotFoundException(`Technology with ID "${dto.technologyId}" not found.`);
        }

        // Check if the technology is already assigned to this project
        const existingAssignment = await this.projectTechnologyRepository.findOne({
            where: {
                project: { id: dto.projectId },
                technology: { id: dto.technologyId },
            },
        });

        if (existingAssignment) {
            throw new ConflictException(`Technology with ID "${dto.technologyId}" is already assigned to Project with ID "${dto.projectId}".`);
        }

        const projectTechnology = this.projectTechnologyRepository.create({
            ...dto,
            project,
            technology,
            assignedAt: dto.assignedAt ? new Date(dto.assignedAt) : undefined, // Let default handle if undefined
        });

        return this.projectTechnologyRepository.save(projectTechnology);
    }

    async findAll(): Promise<ProjectTechnology[]> {
        return this.projectTechnologyRepository.find({
            relations: ['project', 'technology'],
        });
    }

    async findOne(id: string): Promise<ProjectTechnology> {
        const projectTechnology = await this.projectTechnologyRepository.findOne({
            where: { id },
            relations: ['project', 'technology'],
        });
        if (!projectTechnology) {
            throw new NotFoundException(`Project Technology assignment with ID "${id}" not found.`);
        }
        return projectTechnology;
    }

    // Optional: Find all technologies assigned to a specific project
    async findByProjectId(projectId: string): Promise<ProjectTechnology[]> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
        return this.projectTechnologyRepository.find({
            where: { project: { id: projectId } },
            relations: ['technology', 'project'],
        });
    }

    // Update operation primarily for 'assignedAt' if needed, or if we add other fields later.
    // Note: Changing projectId or technologyId would typically mean deleting and re-creating
    // due to the @Unique(['projectId', 'technologyId']) constraint.
    async update(id: string, dto: UpdateProjectTechnologyDto): Promise<ProjectTechnology> {
        const projectTechnology = await this.findOne(id); // Ensures assignment exists

        const { projectId, technologyId, assignedAt, ...rest } = dto;

        Object.assign(projectTechnology, rest);

        if (assignedAt !== undefined) {
            projectTechnology.assignedAt = assignedAt ? new Date(assignedAt) : null;
        }

        return this.projectTechnologyRepository.save(projectTechnology);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectTechnologyRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project Technology assignment with ID "${id}" not found.`);
        }
    }
}