import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) { }

    async create(createServiceDto: CreateServiceDto): Promise<Service> {
        // Check if a service with the same name already exists
        const existingService = await this.servicesRepository.findOne({
            where: { name: createServiceDto.name },
        });
        if (existingService) {
            throw new ConflictException(`Service with name "${createServiceDto.name}" already exists.`);
        }

        const service = this.servicesRepository.create(createServiceDto);
        return this.servicesRepository.save(service);
    }

    async findAll(): Promise<Service[]> {
        return this.servicesRepository.find();
    }

    async findOne(id: string): Promise<Service> {
        const service = await this.servicesRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Service with ID "${id}" not found.`);
        }
        return service;
    }

    async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
        const service = await this.servicesRepository.findOne({ where: { id } });
        if (!service) {
            throw new NotFoundException(`Service with ID "${id}" not found.`);
        }

        // If name is being updated, check for conflicts
        if (updateServiceDto.name && updateServiceDto.name !== service.name) {
            const existingService = await this.servicesRepository.findOne({
                where: { name: updateServiceDto.name },
            });
            if (existingService && existingService.id !== id) {
                throw new ConflictException(`Service with name "${updateServiceDto.name}" already exists.`);
            }
        }

        Object.assign(service, updateServiceDto);
        return this.servicesRepository.save(service);
    }

    async remove(id: string): Promise<void> {
        const result = await this.servicesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Service with ID "${id}" not found.`);
        }
    }
}