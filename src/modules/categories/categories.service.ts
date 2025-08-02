import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const { slug } = createCategoryDto;
        const existingCategory = await this.categoryRepository.findOne({ where: { slug } });
        if (existingCategory) {
            throw new ConflictException(`Category with slug '${slug}' already exists.`);
        }

        const newCategory = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(newCategory);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found.`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        // Check if the new slug is already in use by another category
        if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
            const existingCategory = await this.categoryRepository.findOne({ where: { slug: updateCategoryDto.slug } });
            if (existingCategory && existingCategory.id !== id) {
                throw new ConflictException(`Category with slug '${updateCategoryDto.slug}' already exists.`);
            }
        }

        this.categoryRepository.merge(category, updateCategoryDto);
        return this.categoryRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
    }
}