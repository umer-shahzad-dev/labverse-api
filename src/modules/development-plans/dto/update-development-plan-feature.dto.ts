import { PartialType } from '@nestjs/mapped-types';
import { CreateDevelopmentPlanFeatureDto } from './create-development-plan-feature.dto';

export class UpdateDevelopmentPlanFeatureDto extends PartialType(CreateDevelopmentPlanFeatureDto) { }