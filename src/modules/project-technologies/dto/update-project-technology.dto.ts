import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectTechnologyDto } from './create-project-technology.dto';

export class UpdateProjectTechnologyDto extends PartialType(CreateProjectTechnologyDto) {}