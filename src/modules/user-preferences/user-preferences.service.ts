import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { CreateUserPreferenceDto } from './dto/create-user-preference.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserPreferencesService {
    constructor(
        @InjectRepository(UserPreference)
        private readonly userPreferenceRepository: Repository<UserPreference>,
        private readonly usersService: UsersService,
    ) { }

    async findOne(user: User): Promise<UserPreference> {
        const userPreference = await this.userPreferenceRepository.findOne({ where: { user: { id: user.id } } });

        if (!userPreference) {
            // If a preference doesn't exist, create one with default values
            const newUserPreference = this.userPreferenceRepository.create({
                user: user,
            });
            return this.userPreferenceRepository.save(newUserPreference);
        }
        return userPreference;
    }

    async update(user: User, updateUserPreferenceDto: UpdateUserPreferenceDto): Promise<UserPreference> {
        let userPreference = await this.userPreferenceRepository.findOne({ where: { user: { id: user.id } } });

        if (!userPreference) {
            throw new NotFoundException('User preference not found. Please create one first.');
        }

        Object.assign(userPreference, updateUserPreferenceDto);
        return this.userPreferenceRepository.save(userPreference);
    }

    async remove(user: User): Promise<void> {
        const result = await this.userPreferenceRepository.delete({ user: { id: user.id } });
        if (result.affected === 0) {
            throw new NotFoundException('User preference not found.');
        }
    }
}
