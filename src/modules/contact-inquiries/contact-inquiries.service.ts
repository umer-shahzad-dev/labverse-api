import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInquiry } from './entities/contact-inquiry.entity';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { UpdateContactInquiryDto } from './dto/update-contact-inquiry.dto';

@Injectable()
export class ContactInquiriesService {
    constructor(
        @InjectRepository(ContactInquiry)
        private readonly contactInquiryRepository: Repository<ContactInquiry>,
    ) { }

    async create(createContactInquiryDto: CreateContactInquiryDto): Promise<ContactInquiry> {
        const newInquiry = this.contactInquiryRepository.create(createContactInquiryDto);
        return this.contactInquiryRepository.save(newInquiry);
    }

    async findAll(): Promise<ContactInquiry[]> {
        return this.contactInquiryRepository.find();
    }

    async findOne(id: string): Promise<ContactInquiry> {
        const inquiry = await this.contactInquiryRepository.findOne({
            where: { id },
        });
        if (!inquiry) {
            throw new NotFoundException(`Contact Inquiry with ID "${id}" not found.`);
        }
        return inquiry;
    }

    async update(id: string, updateContactInquiryDto: UpdateContactInquiryDto): Promise<ContactInquiry> {
        const inquiry = await this.contactInquiryRepository.findOne({
            where: { id },
        });
        if (!inquiry) {
            throw new NotFoundException(`Contact Inquiry with ID "${id}" not found.`);
        }

        this.contactInquiryRepository.merge(inquiry, updateContactInquiryDto);
        return this.contactInquiryRepository.save(inquiry);
    }

    async remove(id: string): Promise<void> {
        const inquiry = await this.contactInquiryRepository.findOne({
            where: { id },
        });
        if (!inquiry) {
            throw new NotFoundException(`Contact Inquiry with ID "${id}" not found.`);
        }

        await this.contactInquiryRepository.remove(inquiry);
    }
}