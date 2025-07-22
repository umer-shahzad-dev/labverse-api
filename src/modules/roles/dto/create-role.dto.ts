import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { RoleEnum } from '../role.enum';

export class CreateRoleDto {
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
