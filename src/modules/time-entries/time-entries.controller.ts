import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
} from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Request } from 'express'; // Standard Express Request type
import { User } from '../users/entities/user.entity'; // For req.user type hint

interface RequestWithUser extends Request {
    user: User; // Assuming req.user is populated by JwtAuthGuard
}

@Controller('time-entries')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimeEntriesController {
    constructor(private readonly timeEntriesService: TimeEntriesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_time_entry')
    create(@Body() createTimeEntryDto: CreateTimeEntryDto, @Req() req: RequestWithUser) {
        // Optionally override userId from token to ensure user logs their own time,
        // or allow admin to log time for others based on specific permission.
        // For now, let's assume `userId` in DTO is the user whose time is being logged.
        // If you want to force logging for the authenticated user:
        // createTimeEntryDto.userId = req.user.id;
        return this.timeEntriesService.create(createTimeEntryDto);
    }

    @Get()
    @Permissions('read_time_entry')
    findAll() {
        return this.timeEntriesService.findAll();
    }

    @Get(':id')
    @Permissions('read_time_entry')
    findOne(@Param('id') id: string) {
        return this.timeEntriesService.findOne(id);
    }

    @Patch(':id')
    @Permissions('update_time_entry')
    update(@Param('id') id: string, @Body() updateTimeEntryDto: UpdateTimeEntryDto) {
        return this.timeEntriesService.update(id, updateTimeEntryDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Permissions('delete_time_entry')
    remove(@Param('id') id: string) {
        return this.timeEntriesService.remove(id);
    }

    // --- Reporting Endpoints (initial) ---
    @Get('by-project/:projectId')
    @Permissions('read_time_entry_report') // New permission for reports
    getTimeEntriesByProject(@Param('projectId') projectId: string) {
        return this.timeEntriesService.findTimeEntriesByProject(projectId);
    }

    @Get('by-user/:userId')
    @Permissions('read_time_entry_report') // New permission for reports
    getTimeEntriesByUser(@Param('userId') userId: string) {
        return this.timeEntriesService.findTimeEntriesByUser(userId);
    }
}