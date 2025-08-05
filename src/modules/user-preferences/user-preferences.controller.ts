import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Req,
    Delete,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
    constructor(private readonly userPreferencesService: UserPreferencesService) { }

    @Get()
    async findOne(@Req() req: any) {
        const user = req.user as User;
        return this.userPreferencesService.findOne(user);
    }

    @Patch()
    async update(@Req() req: any, @Body() updateUserPreferenceDto: UpdateUserPreferenceDto) {
        const user = req.user as User;
        return this.userPreferencesService.update(user, updateUserPreferenceDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Req() req: any) {
        const user = req.user as User;
        await this.userPreferencesService.remove(user);
    }
}
