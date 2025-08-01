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
// Removed import of User and the custom interface.
// import { User } from '../users/entities/user.entity'; // For req.user type hint
// interface RequestWithUser extends Request { ... }

@Controller('time-entries')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimeEntriesController {
    constructor(private readonly timeEntriesService: TimeEntriesService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Permissions('create_time_entry')
    create(@Body() createTimeEntryDto: CreateTimeEntryDto, @Req() req: Request) {
        // req.user is now correctly typed as JwtPayload thanks to the global declaration
        // const userIdFromToken = req.user.id;
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