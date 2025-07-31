import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpCode,
    HttpStatus,
    BadRequestException, // Ensure this is imported
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
// REMOVED SWAGGER IMPORTS (as per your request)
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
// Corrected path and decorator name as per your project
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
// REMOVED: import { RequestWithUser } from '../../core/interfaces/request-with-user.interface';
import { Task } from './entities/task.entity';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { TaskComment } from './entities/task-comment.entity';
import { TaskPriority, TaskStatus } from './entities/task.entity'; // Import enums
import { User } from '../users/entities/user.entity'; // Import User for req.user type hint

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    // --- Task Endpoints ---

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_task') // Changed back to @Permissions
    create(@Body() createTaskDto: CreateTaskDto, @Req() req: { user: User }) { // Type hint req.user as User
        return this.tasksService.createTask(createTaskDto, req.user);
    }

    @Get()
    @Permissions('read_task') // Changed back to @Permissions
    findAll() {
        return this.tasksService.findAllTasks();
    }

    @Get(':id')
    @Permissions('read_task') // Changed back to @Permissions
    findOne(@Param('id') id: string) {
        return this.tasksService.findOneTask(id);
    }

    @Patch(':id')
    @Permissions('update_task') // Changed back to @Permissions
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_task') // Changed back to @Permissions
    remove(@Param('id') id: string) {
        return this.tasksService.deleteTask(id);
    }

    // --- API for Assigning Task ---
    @Patch(':id/assign/:userId')
    @Permissions('assign_task') // Changed back to @Permissions
    assignTask(@Param('id') taskId: string, @Param('userId') userId: string) {
        return this.tasksService.assignTask(taskId, userId);
    }

    // --- API for Updating Task Status ---
    @Patch(':id/status/:status')
    @Permissions('update_task_status') // Changed back to @Permissions
    updateStatus(@Param('id') taskId: string, @Param('status') status: TaskStatus) {
        // Validate status string against enum
        if (!Object.values(TaskStatus).includes(status)) {
            // FIX: Changed single quotes to backticks for template literal
            throw new BadRequestException(`Invalid task status: ${status}. Must be one of ${Object.values(TaskStatus).join(', ')}`);
        }
        return this.tasksService.updateTaskStatus(taskId, status);
    }

    // --- API for Updating Task Priority ---
    @Patch(':id/priority/:priority')
    @Permissions('update_task_priority') // Changed back to @Permissions
    updatePriority(@Param('id') taskId: string, @Param('priority') priority: TaskPriority) {
        // Validate priority string against enum
        if (!Object.values(TaskPriority).includes(priority)) {
            // FIX: Changed single quotes to backticks for template literal
            throw new BadRequestException(`Invalid task priority: ${priority}. Must be one of ${Object.values(TaskPriority).join(', ')}`);
        }
        return this.tasksService.updateTaskPriority(taskId, priority);
    }

    // --- Task Comment Endpoints ---

    @Post(':taskId/comments')
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_task_comment') // Changed back to @Permissions
    createComment(
        @Param('taskId') taskId: string,
        @Body() createCommentDto: CreateTaskCommentDto,
        @Req() req: { user: User }, // Type hint req.user as User
    ) {
        return this.tasksService.createTaskComment(taskId, createCommentDto, req.user);
    }

    @Get(':taskId/comments')
    @Permissions('read_task_comment') // Changed back to @Permissions
    findAllComments(@Param('taskId') taskId: string) {
        return this.tasksService.findAllTaskComments(taskId);
    }

    @Get('comments/:commentId') // This route is different to avoid ambiguity with :taskId/comments/:commentId if taskId is not passed
    @Permissions('read_task_comment') // Changed back to @Permissions
    findOneComment(@Param('commentId') commentId: string) {
        return this.tasksService.findOneTaskComment(commentId);
    }

    @Patch('comments/:commentId')
    @Permissions('update_task_comment') // Changed back to @Permissions
    updateComment(
        @Param('commentId') commentId: string,
        @Body() updateCommentDto: UpdateTaskCommentDto,
        @Req() req: { user: User }, // Type hint req.user as User
    ) {
        return this.tasksService.updateTaskComment(commentId, updateCommentDto, req.user);
    }

    @Delete('comments/:commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_task_comment') // Changed back to @Permissions
    deleteComment(@Param('commentId') commentId: string, @Req() req: { user: User }) { // Type hint req.user as User
        return this.tasksService.deleteTaskComment(commentId, req.user);
    }
}