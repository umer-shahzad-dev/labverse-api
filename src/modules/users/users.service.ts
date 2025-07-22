import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    let role: Role | undefined;
    if (dto.roleId) {
      role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    }
    const user = this.userRepository.create({
      ...dto,
      role,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: dto.roleId },
      });
      user.role = role;
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(
    email: string,
    opts: { includePassword?: boolean } = {},
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      select: opts.includePassword
        ? ['id', 'email', 'password', 'fullName', 'createdAt', 'updatedAt']
        : undefined,
      relations: ['role'],
    });
  }
}
