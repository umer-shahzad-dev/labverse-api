import { PartialType } from '@nestjs/mapped-types';
import { CreateDevelopmentPlanServiceDto } from './create-development-plan-service.dto';

export class UpdateDevelopmentPlanServiceDto extends PartialType(CreateDevelopmentPlanServiceDto) { }