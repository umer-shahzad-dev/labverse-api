import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMember } from './entities/project-member.entity';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProjectMembersService {
    constructor(
        @InjectRepository(ProjectMember)
        private readonly projectMemberRepository: Repository<ProjectMember>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(dto: CreateProjectMemberDto): Promise<ProjectMember> {
        const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${dto.projectId}" not found.`);
        }

        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${dto.userId}" not found.`);
        }

        // Check if the user is already a member of this project
        const existingMember = await this.projectMemberRepository.findOne({
            where: {
                project: { id: dto.projectId },
                user: { id: dto.userId },
            },
        });

        if (existingMember) {
            throw new ConflictException(`User with ID "${dto.userId}" is already a member of Project with ID "${dto.projectId}".`);
        }

        const projectMember = this.projectMemberRepository.create({
            ...dto,
            project,
            user,
            assignmentDate: dto.assignmentDate ? new Date(dto.assignmentDate) : undefined, // Let default handle if undefined
            endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        });

        return this.projectMemberRepository.save(projectMember);
    }

    async findAll(): Promise<ProjectMember[]> {
        return this.projectMemberRepository.find({
            relations: ['project', 'user'],
        });
    }

    async findOne(id: string): Promise<ProjectMember> {
        const projectMember = await this.projectMemberRepository.findOne({
            where: { id },
            relations: ['project', 'user'],
        });
        if (!projectMember) {
            throw new NotFoundException(`Project Member with ID "${id}" not found.`);
        }
        return projectMember;
    }

    async findByProjectId(projectId: string): Promise<ProjectMember[]> {
        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }
        return this.projectMemberRepository.find({
            where: { project: { id: projectId } },
            relations: ['user', 'project'],
        });
    }

    async update(id: string, dto: UpdateProjectMemberDto): Promise<ProjectMember> {
        const projectMember = await this.findOne(id); // Ensures member exists

        const { projectId, userId, assignmentDate, endDate, ...memberData } = dto;

        // Handle project and user changes (optional: if you want to allow re-assigning members)
        // Note: Changing projectId or userId would typically mean deleting and re-creating
        // a new ProjectMember entry due to the @Unique(['projectId', 'userId']) constraint.
        // For simplicity, we won't allow changing projectId or userId via update here.
        // If these fields are in the DTO, they'll be ignored by Object.assign or you can throw an error.

        Object.assign(projectMember, memberData);

        if (assignmentDate !== undefined) {
            projectMember.assignmentDate = assignmentDate ? new Date(assignmentDate) : null;
        }
        if (endDate !== undefined) {
            projectMember.endDate = endDate ? new Date(endDate) : null;
        }

        return this.projectMemberRepository.save(projectMember);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectMemberRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project Member with ID "${id}" not found.`);
        }
    }
}