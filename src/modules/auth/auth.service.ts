import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from '../roles/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) { }

  async register(dto: RegisterDto): Promise<User> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered.');

    const defaultRole = await this.rolesRepository.findOne({
      where: { name: RoleEnum.USER },
    });
    if (!defaultRole) {
      throw new Error('Default user role not found. Please run the seeder.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    // The creator is null as the user is creating themselves.
    const user = await this.usersService.create(
      {
        ...dto,
        password: hashedPassword,
        roleId: defaultRole.id,
      },
      null,
    );
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email, {
      includePassword: true,
      includeRoleAndPermissions: true,
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(dto: AuthCredentialsDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email, {
      includePassword: true,
      includeRoleAndPermissions: true,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials.');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials.');

    const { password: _, ...userSafe } = user;
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user: userSafe };
  }
}
