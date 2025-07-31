import { PartialType } from '@nestjs/mapped-types';
import { CreateDevelopmentPlanTechnologyDto } from './create-development-plan-technology.dto';

export class UpdateDevelopmentPlanTechnologyDto extends PartialType(CreateDevelopmentPlanTechnologyDto) { }