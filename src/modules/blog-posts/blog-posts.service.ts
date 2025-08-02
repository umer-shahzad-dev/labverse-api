import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class BlogPostsService {
    constructor(
        @InjectRepository(BlogPost)
        private readonly blogPostRepository: Repository<BlogPost>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createBlogPostDto: CreateBlogPostDto, authorId: string): Promise<BlogPost> {
        const { slug, categoryId, ...data } = createBlogPostDto;

        const existingPost = await this.blogPostRepository.findOne({ where: { slug } });
        if (existingPost) {
            throw new ConflictException(`A blog post with slug '${slug}' already exists.`);
        }

        const author = await this.userRepository.findOne({ where: { id: authorId } });
        if (!author) {
            throw new NotFoundException(`Author with ID "${authorId}" not found.`);
        }

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) {
            throw new NotFoundException(`Category with ID "${categoryId}" not found.`);
        }

        const newPost = this.blogPostRepository.create({
            ...data,
            slug,
            author,
            category,
        });
        return this.blogPostRepository.save(newPost);
    }

    async findAll(): Promise<BlogPost[]> {
        return this.blogPostRepository.find({ relations: ['author', 'category'] });
    }

    async findOne(id: string): Promise<BlogPost> {
        const post = await this.blogPostRepository.findOne({
            where: { id },
            relations: ['author', 'category', 'comments', 'comments.author'],
        });
        if (!post) {
            throw new NotFoundException(`Blog Post with ID "${id}" not found.`);
        }
        return post;
    }

    async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
        const post = await this.findOne(id);

        // Check for unique slug
        if (updateBlogPostDto.slug && updateBlogPostDto.slug !== post.slug) {
            const existingPost = await this.blogPostRepository.findOne({ where: { slug: updateBlogPostDto.slug } });
            if (existingPost && existingPost.id !== id) {
                throw new ConflictException(`A blog post with slug '${updateBlogPostDto.slug}' already exists.`);
            }
        }

        // Check for category existence
        if (updateBlogPostDto.categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: updateBlogPostDto.categoryId } });
            if (!category) {
                throw new NotFoundException(`Category with ID "${updateBlogPostDto.categoryId}" not found.`);
            }
            post.category = category;
        }

        this.blogPostRepository.merge(post, updateBlogPostDto);
        return this.blogPostRepository.save(post);
    }

    async remove(id: string): Promise<void> {
        const post = await this.blogPostRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException(`Blog Post with ID "${id}" not found.`);
        }
        await this.blogPostRepository.remove(post);
    }
}