import { IsNotEmpty, IsString, IsNumber, IsUrl } from 'class-validator';

export class CreateFileStorageDto {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    mimeType: string;

    @IsNumber()
    @IsNotEmpty()
    fileSize: number;

    @IsUrl()
    @IsNotEmpty()
    s3Url: string;
}