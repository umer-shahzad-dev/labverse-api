import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreference } from './entities/user-preference.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserPreference]), UsersModule],
    controllers: [UserPreferencesController],
    providers: [UserPreferencesService],
    exports: [UserPreferencesService],
})
export class UserPreferencesModule { }
