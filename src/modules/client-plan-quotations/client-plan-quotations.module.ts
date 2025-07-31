import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPlanQuotationsService } from './client-plan-quotations.service';
import { ClientPlanQuotationsController } from './client-plan-quotations.controller';
import { ClientPlanQuotation } from './entities/client-plan-quotation.entity';
import { User } from '../users/entities/user.entity'; // For client relationship
import { DevelopmentPlan } from '../development-plans/entities/development-plan.entity'; // For development plan relationship
import { DevelopmentPlansService } from '../development-plans/development-plans.service'; // For price calculation

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientPlanQuotation,
            User, // Register User for ClientPlanQuotationService
            DevelopmentPlan, // Register DevelopmentPlan for ClientPlanQuotationService
        ]),
    ],
    controllers: [ClientPlanQuotationsController],
    providers: [
        ClientPlanQuotationsService,
        DevelopmentPlansService, // Provide DevelopmentPlansService as it's used for price calculation
    ],
    exports: [ClientPlanQuotationsService],
})
export class ClientPlanQuotationsModule { }