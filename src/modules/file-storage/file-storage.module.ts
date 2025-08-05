import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorageService } from './file-storage.service';
import { FileStorage } from './entities/file-storage.entity';
import { FileStorageController } from './file-storage.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([FileStorage]),
        MulterModule.register({
            dest: './uploads', // temporary destination for uploaded files
        }),
    ],
    controllers: [FileStorageController],
    providers: [FileStorageService],
    exports: [FileStorageService],
})
export class FileStorageModule { }