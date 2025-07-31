import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeProfilesService } from './employee-profiles.service';
import { EmployeeProfilesController } from './employee-profiles.controller';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { User } from '../users/entities/user.entity'; // Import User entity
import { Skill } from '../skills/entities/skill.entity'; // Import Skill entity

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeProfile, User, Skill])], // Provide User and Skill repositories
    controllers: [EmployeeProfilesController],
    providers: [EmployeeProfilesService],
    exports: [EmployeeProfilesService],
})
export class EmployeeProfilesModule { }