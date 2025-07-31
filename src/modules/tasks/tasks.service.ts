import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectMilestone } from '../project-milestones/entities/project-milestone.entity';
import { TaskComment } from './entities/task-comment.entity';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { FindManyOptions } from 'typeorm'; // Import for better type safety for find options

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
        @InjectRepository(Project)
        private projectsRepository: Repository<Project>,
        @InjectRepository(ProjectMilestone)
        private milestonesRepository: Repository<ProjectMilestone>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(TaskComment)
        private taskCommentsRepository: Repository<TaskComment>,
    ) { }

    // --- Task CRUD Operations ---

    async createTask(createTaskDto: CreateTaskDto, createdByUser: User): Promise<Task> {
        const { projectId, milestoneId, assignedToUserId, ...taskData } = createTaskDto;

        // Verify Project exists
        const project = await this.projectsRepository.findOne({ where: { id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found.`);
        }

        // Verify Milestone exists and belongs to the project (if provided)
        let milestone: ProjectMilestone = null;
        if (milestoneId) {
            milestone = await this.milestonesRepository.findOne({
                where: { id: milestoneId, projectId },
            });
            if (!milestone) {
                throw new NotFoundException(
                    `Milestone with ID "${milestoneId}" not found or does not belong to Project "${projectId}".`,
                );
            }
        }

        // Verify AssignedToUser exists (if provided)
        let assignedToUser: User = null;
        if (assignedToUserId) {
            assignedToUser = await this.usersRepository.findOne({ where: { id: assignedToUserId } });
            if (!assignedToUser) {
                throw new NotFoundException(`User with ID "${assignedToUserId}" not found.`);
            }
        }

        const task = this.tasksRepository.create({
            ...taskData,
            project,
            milestone,
            assignedTo: assignedToUser,
            createdBy: createdByUser, // Assign the user who created the task
        });

        return this.tasksRepository.save(task);
    }

    async findAllTasks(options?: FindManyOptions<Task>): Promise<Task[]> {
        return this.tasksRepository.find(options);
    }

    async findOneTask(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: ['project', 'milestone', 'assignedTo', 'createdBy', 'comments', 'comments.author'],
        });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
        return task;
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }

        const { projectId, milestoneId, assignedToUserId, ...taskData } = updateTaskDto;

        // Handle project update (less common for tasks, but can be done)
        if (projectId && projectId !== task.projectId) {
            const newProject = await this.projectsRepository.findOne({ where: { id: projectId } });
            if (!newProject) {
                throw new NotFoundException(`Project with ID "${projectId}" not found.`);
            }
            task.project = newProject;
            task.projectId = newProject.id;
        }

        // Handle milestone update
        if (milestoneId !== undefined) {
            if (milestoneId === null) { // If milestoneId is explicitly set to null
                task.milestone = null;
                task.milestoneId = null;
            } else if (milestoneId && milestoneId !== task.milestoneId) {
                const newMilestone = await this.milestonesRepository.findOne({
                    where: { id: milestoneId, projectId: task.projectId }, // Ensure new milestone belongs to current project
                });
                if (!newMilestone) {
                    throw new NotFoundException(
                        `Milestone with ID "${milestoneId}" not found or does not belong to Project "${task.projectId}".`,
                    );
                }
                task.milestone = newMilestone;
                task.milestoneId = newMilestone.id;
            }
        }

        // Handle assignedToUser update
        if (assignedToUserId !== undefined) {
            if (assignedToUserId === null) { // If assignedToUserId is explicitly set to null
                task.assignedTo = null;
                task.assignedToUserId = null;
            } else if (assignedToUserId && assignedToUserId !== task.assignedToUserId) {
                const newAssignedToUser = await this.usersRepository.findOne({ where: { id: assignedToUserId } });
                if (!newAssignedToUser) {
                    throw new NotFoundException(`User with ID "${assignedToUserId}" not found.`);
                }
                task.assignedTo = newAssignedToUser;
                task.assignedToUserId = newAssignedToUser.id;
            }
        }

        // Update other simple properties
        Object.assign(task, taskData);

        return this.tasksRepository.save(task);
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found.`);
        }
    }

    // --- Assign Task to User ---
    async assignTask(taskId: string, userId: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }

        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${userId}" not found.`);
        }

        task.assignedTo = user;
        task.assignedToUserId = user.id;
        return this.tasksRepository.save(task);
    }

    // --- Update Task Status ---
    async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }

        task.status = status;
        return this.tasksRepository.save(task);
    }

    // --- Update Task Priority ---
    async updateTaskPriority(taskId: string, priority: TaskPriority): Promise<Task> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }

        task.priority = priority;
        return this.tasksRepository.save(task);
    }

    // --- Task Comment CRUD Operations ---

    async createTaskComment(
        taskId: string,
        createCommentDto: CreateTaskCommentDto,
        author: User,
    ): Promise<TaskComment> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }

        const comment = this.taskCommentsRepository.create({
            ...createCommentDto,
            task,
            author,
        });
        return this.taskCommentsRepository.save(comment);
    }

    async findAllTaskComments(taskId: string): Promise<TaskComment[]> {
        const task = await this.tasksRepository.findOne({ where: { id: taskId } });
        if (!task) {
            throw new NotFoundException(`Task with ID "${taskId}" not found.`);
        }
        return this.taskCommentsRepository.find({
            where: { task: { id: taskId } },
            relations: ['author'],
            order: { createdAt: 'ASC' }, // Order comments chronologically
        });
    }

    async findOneTaskComment(commentId: string): Promise<TaskComment> {
        const comment = await this.taskCommentsRepository.findOne({
            where: { id: commentId },
            relations: ['task', 'author'],
        });
        if (!comment) {
            throw new NotFoundException(`Task comment with ID "${commentId}" not found.`);
        }
        return comment;
    }

    async updateTaskComment(
        commentId: string,
        updateCommentDto: UpdateTaskCommentDto,
        currentUser: User,
    ): Promise<TaskComment> {
        const comment = await this.taskCommentsRepository.findOne({
            where: { id: commentId },
            relations: ['author'],
        });
        if (!comment) {
            throw new NotFoundException(`Task comment with ID "${commentId}" not found.`);
        }

        // Only the author can update their comment (or an admin/super_admin if you want to add that logic)
        if (comment.author.id !== currentUser.id) {
            throw new ForbiddenException('You are not authorized to update this comment.');
        }

        Object.assign(comment, updateCommentDto);
        return this.taskCommentsRepository.save(comment);
    }

    async deleteTaskComment(commentId: string, currentUser: User): Promise<void> {
        const comment = await this.taskCommentsRepository.findOne({
            where: { id: commentId },
            relations: ['author'],
        });
        if (!comment) {
            throw new NotFoundException(`Task comment with ID "${commentId}" not found.`);
        }

        // Only the author can delete their comment (or an admin/super_admin)
        // You might want to add a permission check here for 'delete_any_task_comment' for admins
        if (comment.author.id !== currentUser.id) {
            throw new ForbiddenException('You are not authorized to delete this comment.');
        }

        const result = await this.taskCommentsRepository.delete(commentId);
        if (result.affected === 0) {
            // This check is technically redundant here because we already found the comment
            // but good practice for services that delete directly by ID without prior find
            throw new NotFoundException(`Task comment with ID "${commentId}" not found.`);
        }
    }
}