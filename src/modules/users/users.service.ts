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
    // We should load permissions here as well for consistency
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('role.permissions', 'permissions')
      .getOne();

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

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

  // 👇 CORRECTED METHOD
  async findByEmail(
    email: string,
    opts: { includePassword?: boolean; includeRoleAndPermissions?: boolean } = {},
  ): Promise<User | undefined> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    if (opts.includePassword) {
      queryBuilder.addSelect('user.password');
    }

    if (opts.includeRoleAndPermissions) {
      queryBuilder.leftJoinAndSelect('user.role', 'role');
      queryBuilder.leftJoinAndSelect('role.permissions', 'permissions');
    }

    return queryBuilder.getOne();
  }
}