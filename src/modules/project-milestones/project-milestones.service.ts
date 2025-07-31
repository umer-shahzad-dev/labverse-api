import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMilestone } from './entities/project-milestone.entity';
import { CreateProjectMilestoneDto } from './dto/create-project-milestone.dto';
import { UpdateProjectMilestoneDto } from './dto/update-project-milestone.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class ProjectMilestonesService {
    constructor(
        @InjectRepository(ProjectMilestone)
        private readonly projectMilestoneRepository: Repository<ProjectMilestone>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    ) { }

    async create(createMilestoneDto: CreateProjectMilestoneDto): Promise<ProjectMilestone> {
        const project = await this.projectRepository.findOne({ where: { id: createMilestoneDto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${createMilestoneDto.projectId}" not found.`);
        }

        // Optional: Add logic to prevent duplicate milestone titles for the same project if desired
        // const existingMilestone = await this.projectMilestoneRepository.findOne({
        //   where: {
        //     projectId: createMilestoneDto.projectId,
        //     title: createMilestoneDto.title
        //   }
        // });
        // if (existingMilestone) {
        //   throw new ConflictException(`Milestone with title "${createMilestoneDto.title}" already exists for this project.`);
        // }

        const milestone = this.projectMilestoneRepository.create({
            ...createMilestoneDto,
            project,
            dueDate: createMilestoneDto.dueDate ? new Date(createMilestoneDto.dueDate) : null,
            completedDate: createMilestoneDto.completedDate ? new Date(createMilestoneDto.completedDate) : null,
        });
        return this.projectMilestoneRepository.save(milestone);
    }

    async findAll(): Promise<ProjectMilestone[]> {
        return this.projectMilestoneRepository.find({
            relations: ['project'],
        });
    }

    async findOne(id: string): Promise<ProjectMilestone> {
        const milestone = await this.projectMilestoneRepository.findOne({
            where: { id },
            relations: ['project'],
        });
        if (!milestone) {
            throw new NotFoundException(`Project Milestone with ID "${id}" not found.`);
        }
        return milestone;
    }

    // Find all milestones for a specific project
    async findByProjectId(projectId: string): Promise<ProjectMilestone[]> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
        return this.projectMilestoneRepository.find({
            where: { project: { id: projectId } },
            relations: ['project'],
        });
    }

    async update(id: string, updateMilestoneDto: UpdateProjectMilestoneDto): Promise<ProjectMilestone> {
        const milestone = await this.findOne(id); // Ensures milestone exists

        // Handle project ID change if allowed (typically not for related entities)
        if (updateMilestoneDto.projectId && updateMilestoneDto.projectId !== milestone.projectId) {
            const newProject = await this.projectRepository.findOne({ where: { id: updateMilestoneDto.projectId } });
            if (!newProject) {
                throw new NotFoundException(`Project with ID "${updateMilestoneDto.projectId}" not found.`);
            }
            milestone.project = newProject;
            milestone.projectId = newProject.id;
        }

        const { projectId, dueDate, completedDate, ...rest } = updateMilestoneDto;

        Object.assign(milestone, rest);

        if (dueDate !== undefined) {
            milestone.dueDate = dueDate ? new Date(dueDate) : null;
        }
        if (completedDate !== undefined) {
            milestone.completedDate = completedDate ? new Date(completedDate) : null;
        }

        return this.projectMilestoneRepository.save(milestone);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectMilestoneRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project Milestone with ID "${id}" not found.`);
        }
    }
}