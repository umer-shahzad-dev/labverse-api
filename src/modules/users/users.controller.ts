import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req, // Import the Request object
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { User } from './entities/user.entity'; // Import the User entity

@Controller('users')
// Apply the guards to all routes in this controller
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Permissions('manage_users')
  create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    // Pass the currently authenticated user as the 'creator'
    const creator = req.user as User;
    return this.usersService.create(createUserDto, creator);
  }

  @Get()
  @Permissions('manage_users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('manage_users')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Permissions('manage_users')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('manage_users')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
