import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditLogsService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepository: Repository<AuditLog>,
    ) { }

    async create(createAuditLogDto: CreateAuditLogDto, user: User): Promise<AuditLog> {
        const auditLog = this.auditLogRepository.create({
            ...createAuditLogDto,
            user,
        });
        return this.auditLogRepository.save(auditLog);
    }

    async findAll(): Promise<AuditLog[]> {
        return this.auditLogRepository.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
}