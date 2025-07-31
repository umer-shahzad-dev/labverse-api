import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevelopmentPlansService } from './development-plans.service';
import { DevelopmentPlansController } from './development-plans.controller';
import { DevelopmentPlan } from './entities/development-plan.entity';

import { DevelopmentPlanFeaturesService } from './development-plan-features.service';
import { DevelopmentPlanFeaturesController } from './development-plan-features.controller';
import { DevelopmentPlanFeature } from './entities/development-plan-feature.entity';

import { DevelopmentPlanServicesService } from './development-plan-services.service';
import { DevelopmentPlanServicesController } from './development-plan-services.controller';
import { DevelopmentPlanService } from './entities/development-plan-service.entity';

import { DevelopmentPlanTechnologiesService } from './development-plan-technologies.service'; 
import { DevelopmentPlanTechnologiesController } from './development-plan-technologies.controller'; 
import { DevelopmentPlanTechnology } from './entities/development-plan-technology.entity'; 

import { PlanFeature } from '../plan-features/entities/plan-feature.entity';
import { Service } from '../services/entities/service.entity';
import { Technology } from '../technologies/entities/technology.entity'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DevelopmentPlan,
            DevelopmentPlanFeature,
            DevelopmentPlanService,
            DevelopmentPlanTechnology, 
            PlanFeature,
            Service,
            Technology, 
        ]),
    ],
    controllers: [
        DevelopmentPlansController,
        DevelopmentPlanFeaturesController,
        DevelopmentPlanServicesController,
        DevelopmentPlanTechnologiesController, 
    ],
    providers: [
        DevelopmentPlansService,
        DevelopmentPlanFeaturesService,
        DevelopmentPlanServicesService,
        DevelopmentPlanTechnologiesService, 
    ],
    exports: [
        DevelopmentPlansService,
        DevelopmentPlanFeaturesService,
        DevelopmentPlanServicesService,
        DevelopmentPlanTechnologiesService, 
    ],
})
export class DevelopmentPlansModule { }