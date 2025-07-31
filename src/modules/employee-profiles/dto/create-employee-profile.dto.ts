import {
    IsString,
    IsOptional,
    IsDateString,
    IsUUID,
    IsArray,
    IsNotEmpty,
    ValidateIf,
} from 'class-validator';

export class CreateEmployeeProfileDto {
    @IsUUID()
    userId: string; // The ID of the associated User from the users module

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstName?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastName?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    contactNumber?: string;

    @IsOptional()
    @IsDateString()
    hireDate?: string;

    @IsOptional()
    @IsString()
    position?: string;

    @IsOptional()
    @IsString()
    department?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    skillIds?: string[]; // IDs of skills to associate with this employee
}