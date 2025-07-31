import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEnum, IsUUID, IsArray } from 'class-validator';
import { RoleEnum } from '../role.enum';

export class CreateRoleDto {
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}