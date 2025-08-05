import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileStorage } from './entities/file-storage.entity';
import { CreateFileStorageDto } from './dto/create-file-storage.dto';
import { UpdateFileStorageDto } from './dto/update-file-storage.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FileStorageService {
    constructor(
        @InjectRepository(FileStorage)
        private readonly fileStorageRepository: Repository<FileStorage>,
    ) { }

    async create(createFileStorageDto: CreateFileStorageDto, uploadedBy: User): Promise<FileStorage> {
        const newFile = this.fileStorageRepository.create({
            ...createFileStorageDto,
            uploadedBy,
        });
        return this.fileStorageRepository.save(newFile);
    }

    async findAll(): Promise<FileStorage[]> {
        return this.fileStorageRepository.find({
            relations: ['uploadedBy'],
        });
    }

    async findOne(id: string): Promise<FileStorage> {
        const file = await this.fileStorageRepository.findOne({
            where: { id },
            relations: ['uploadedBy'],
        });
        if (!file) {
            throw new NotFoundException(`File with ID "${id}" not found.`);
        }
        return file;
    }

    async update(id: string, updateFileStorageDto: UpdateFileStorageDto): Promise<FileStorage> {
        const file = await this.fileStorageRepository.findOne({
            where: { id },
        });
        if (!file) {
            throw new NotFoundException(`File with ID "${id}" not found.`);
        }

        this.fileStorageRepository.merge(file, updateFileStorageDto);
        return this.fileStorageRepository.save(file);
    }

    async remove(id: string): Promise<void> {
        const file = await this.fileStorageRepository.findOne({
            where: { id },
        });
        if (!file) {
            throw new NotFoundException(`File with ID "${id}" not found.`);
        }

        await this.fileStorageRepository.remove(file);
    }
}