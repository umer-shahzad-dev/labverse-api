import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUpdate } from './entities/project-update.entity';
import { CreateProjectUpdateDto } from './dto/create-project-update.dto';
import { UpdateProjectUpdateDto } from './dto/update-project-update.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectUpdatesService {
    constructor(
        @InjectRepository(ProjectUpdate)
        private readonly projectUpdateRepository: Repository<ProjectUpdate>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(createUpdateDto: CreateProjectUpdateDto): Promise<ProjectUpdate> {
        const project = await this.projectRepository.findOne({ where: { id: createUpdateDto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${createUpdateDto.projectId}" not found.`);
        }

        let user: User | undefined;
        if (createUpdateDto.userId) {
            user = await this.userRepository.findOne({ where: { id: createUpdateDto.userId } });
            if (!user) {
                throw new NotFoundException(`User with ID "${createUpdateDto.userId}" not found.`);
            }
        }

        const projectUpdate = this.projectUpdateRepository.create({
            ...createUpdateDto,
            project,
            user,
            updateDate: createUpdateDto.updateDate ? new Date(createUpdateDto.updateDate) : undefined, // Let default handle if undefined
        });
        return this.projectUpdateRepository.save(projectUpdate);
    }

    async findAll(): Promise<ProjectUpdate[]> {
        return this.projectUpdateRepository.find({
            relations: ['project', 'user'],
        });
    }

    async findOne(id: string): Promise<ProjectUpdate> {
        const update = await this.projectUpdateRepository.findOne({
            where: { id },
            relations: ['project', 'user'],
        });
        if (!update) {
            throw new NotFoundException(`Project Update with ID "${id}" not found.`);
        }
        return update;
    }

    // Find all updates for a specific project
    async findByProjectId(projectId: string): Promise<ProjectUpdate[]> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
        return this.projectUpdateRepository.find({
            where: { project: { id: projectId } },
            relations: ['project', 'user'],
            order: { updateDate: 'DESC', createdAt: 'DESC' }, // Order by most recent update
        });
    }

    async update(id: string, updateUpdateDto: UpdateProjectUpdateDto): Promise<ProjectUpdate> {
        const projectUpdate = await this.findOne(id); // Ensures update exists

        // Handle project ID change if allowed (typically not for related entities)
        if (updateUpdateDto.projectId && updateUpdateDto.projectId !== projectUpdate.projectId) {
            const newProject = await this.projectRepository.findOne({ where: { id: updateUpdateDto.projectId } });
            if (!newProject) {
                throw new NotFoundException(`Project with ID "${updateUpdateDto.projectId}" not found.`);
            }
            projectUpdate.project = newProject;
            projectUpdate.projectId = newProject.id;
        }

        // Handle user ID change if allowed
        if (updateUpdateDto.userId && updateUpdateDto.userId !== projectUpdate.userId) {
            const newUser = await this.userRepository.findOne({ where: { id: updateUpdateDto.userId } });
            if (!newUser) {
                throw new NotFoundException(`User with ID "${updateUpdateDto.userId}" not found.`);
            }
            projectUpdate.user = newUser;
            projectUpdate.userId = newUser.id;
        } else if (updateUpdateDto.userId === null) {
            projectUpdate.user = null;
            projectUpdate.userId = null;
        }


        const { projectId, userId, updateDate, ...rest } = updateUpdateDto;

        Object.assign(projectUpdate, rest);

        if (updateDate !== undefined) {
            projectUpdate.updateDate = updateDate ? new Date(updateDate) : null;
        }

        return this.projectUpdateRepository.save(projectUpdate);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectUpdateRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project Update with ID "${id}" not found.`);
        }
    }
}