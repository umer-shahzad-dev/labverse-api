import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsOptional()
  @IsUUID()
  roleId?: string;
}
