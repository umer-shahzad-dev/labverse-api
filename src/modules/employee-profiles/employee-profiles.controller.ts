import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EmployeeProfilesService } from './employee-profiles.service';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('employee-profiles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_employee_profiles') // This permission will be needed to manage employee profiles
export class EmployeeProfilesController {
    constructor(private readonly employeeProfilesService: EmployeeProfilesService) { }

    @Post()
    create(@Body() createEmployeeProfileDto: CreateEmployeeProfileDto) {
        return this.employeeProfilesService.create(createEmployeeProfileDto);
    }

    @Get()
    findAll() {
        return this.employeeProfilesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.employeeProfilesService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateEmployeeProfileDto: UpdateEmployeeProfileDto) {
        return this.employeeProfilesService.update(id, updateEmployeeProfileDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.employeeProfilesService.remove(id);
    }

    // Optional: Endpoint to get an employee profile by user ID
    @Get('user/:userId')
    findOneByUserId(@Param('userId') userId: string) {
        return this.employeeProfilesService.findOneByUserId(userId);
    }
}