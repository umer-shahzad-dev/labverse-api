import { PartialType } from '@nestjs/mapped-types';
import { CreateContactInquiryDto } from './create-contact-inquiry.dto';

export class UpdateContactInquiryDto extends PartialType(CreateContactInquiryDto) { }