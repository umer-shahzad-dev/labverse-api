import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';

@Controller('skills')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('manage_skills') // This permission will be needed to manage skills
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Post()
    create(@Body() createSkillDto: CreateSkillDto) {
        return this.skillsService.create(createSkillDto);
    }

    @Get()
    findAll() {
        return this.skillsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.skillsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
        return this.skillsService.update(id, updateSkillDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.skillsService.remove(id);
    }
}