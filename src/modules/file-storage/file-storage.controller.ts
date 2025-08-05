import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { CreateFileStorageDto } from './dto/create-file-storage.dto';
import { UpdateFileStorageDto } from './dto/update-file-storage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

// Fix for 'Express.Multer.File' issue. 
// We get the type directly from the request object, which is more reliable.
interface RequestWithFile extends Request {
    file: Express.Multer.File;
}

@Controller('file-storage')
export class FileStorageController {
    constructor(private readonly fileStorageService: FileStorageService) { }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Post('upload')
    @Permissions('manage_file_storage')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = uuidv4();
                const fileExtName = extname(file.originalname);
                cb(null, `${uniqueName}${fileExtName}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        if (!file) {
            return { message: 'No file uploaded.' };
        }

        // For this mock implementation, we simulate the S3 URL
        const s3Url = `https://mock-s3-bucket.com/${file.filename}`;

        const createFileDto: CreateFileStorageDto = {
            fileName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            s3Url,
        };

        const user = req.user;
        const newFile = await this.fileStorageService.create(createFileDto, user);

        return {
            message: 'File uploaded and metadata saved successfully.',
            file: newFile,
        };
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Get()
    @Permissions('manage_file_storage')
    findAll() {
        return this.fileStorageService.findAll();
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Get(':id')
    @Permissions('manage_file_storage')
    findOne(@Param('id') id: string) {
        return this.fileStorageService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Patch(':id')
    @Permissions('manage_file_storage')
    update(
        @Param('id') id: string,
        @Body() updateFileStorageDto: UpdateFileStorageDto,
    ) {
        return this.fileStorageService.update(id, updateFileStorageDto);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Delete(':id')
    @Permissions('manage_file_storage')
    remove(@Param('id') id: string) {
        return this.fileStorageService.remove(id);
    }
}