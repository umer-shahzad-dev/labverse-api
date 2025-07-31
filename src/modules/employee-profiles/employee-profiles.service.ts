import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';

@Injectable()
export class EmployeeProfilesService {
    constructor(
        @InjectRepository(EmployeeProfile)
        private readonly employeeProfileRepository: Repository<EmployeeProfile>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // To find the associated user
        @InjectRepository(Skill)
        private readonly skillRepository: Repository<Skill>, // To find and associate skills
    ) { }

    async create(dto: CreateEmployeeProfileDto): Promise<EmployeeProfile> {
        const user = await this.userRepository.findOne({ where: { id: dto.userId } });
        if (!user) {
            throw new NotFoundException(`User with ID "${dto.userId}" not found.`);
        }

        const existingProfile = await this.employeeProfileRepository.findOne({ where: { user: { id: dto.userId } } });
        if (existingProfile) {
            throw new ConflictException(`Employee profile for user ID "${dto.userId}" already exists.`);
        }

        const skills = dto.skillIds
            ? await this.skillRepository.findByIds(dto.skillIds)
            : [];

        const employeeProfile = this.employeeProfileRepository.create({
            ...dto,
            user,
            skills,
            dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
            hireDate: dto.hireDate ? new Date(dto.hireDate) : null,
        });

        return this.employeeProfileRepository.save(employeeProfile);
    }

    async findAll(): Promise<EmployeeProfile[]> {
        return this.employeeProfileRepository.find({
            relations: ['user', 'skills'],
        });
    }

    async findOne(id: string): Promise<EmployeeProfile> {
        const employeeProfile = await this.employeeProfileRepository.findOne({
            where: { id },
            relations: ['user', 'skills'],
        });
        if (!employeeProfile) {
            throw new NotFoundException(`Employee Profile with ID "${id}" not found.`);
        }
        return employeeProfile;
    }

    // Find by user ID
    async findOneByUserId(userId: string): Promise<EmployeeProfile> {
        const employeeProfile = await this.employeeProfileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user', 'skills'],
        });
        if (!employeeProfile) {
            throw new NotFoundException(`Employee Profile for user ID "${userId}" not found.`);
        }
        return employeeProfile;
    }

    async update(id: string, dto: UpdateEmployeeProfileDto): Promise<EmployeeProfile> {
        const employeeProfile = await this.findOne(id);

        const { userId, skillIds, dateOfBirth, hireDate, ...profileData } = dto; // 👈 Destructure date fields

        // Apply basic profile data updates
        Object.assign(employeeProfile, profileData);

        // Update skills if skillIds are provided
        if (skillIds !== undefined) {
            employeeProfile.skills = await this.skillRepository.findByIds(skillIds);
        }

        // Convert and assign date strings to Date objects if they exist in the DTO
        if (dateOfBirth !== undefined) { // 👈 Check if dateOfBirth is provided
            employeeProfile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
        }
        if (hireDate !== undefined) { // 👈 Check if hireDate is provided
            employeeProfile.hireDate = hireDate ? new Date(hireDate) : null;
        }

        return this.employeeProfileRepository.save(employeeProfile);
    }

    async remove(id: string): Promise<void> {
        const result = await this.employeeProfileRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Employee Profile with ID "${id}" not found.`);
        }
    }
}