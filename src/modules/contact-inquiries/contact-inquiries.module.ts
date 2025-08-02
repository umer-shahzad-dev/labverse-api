import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInquiriesService } from './contact-inquiries.service';
import { ContactInquiry } from './entities/contact-inquiry.entity';
import { ContactInquiriesController } from './contact-inquiries.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ContactInquiry])],
    providers: [ContactInquiriesService],
    controllers: [ContactInquiriesController],
})
export class ContactInquiriesModule { }