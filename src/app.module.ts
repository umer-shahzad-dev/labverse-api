import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { SkillsModule } from './modules/skills/skills.module';
import { EmployeeProfilesModule } from './modules/employee-profiles/employee-profiles.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectMembersModule } from './modules/project-members/project-members.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { ProjectTechnologiesModule } from './modules/project-technologies/project-technologies.module';
import { ProjectClientsModule } from './modules/project-clients/project-clients.module';
import { ProjectMilestonesModule } from './modules/project-milestones/project-milestones.module';
import { ProjectUpdatesModule } from './modules/project-updates/project-updates.module';
import { ClientProjectsModule } from './modules/client-projects/client-projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { TimeEntriesModule } from './modules/time-entries/time-entries.module';
import { ServicesModule } from './modules/services/services.module';
import { DevelopmentPlansModule } from './modules/development-plans/development-plans.module';
import { PlanFeaturesModule } from './modules/plan-features/plan-features.module';
import { ClientPlanQuotationsModule } from './modules/client-plan-quotations/client-plan-quotations.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { MessagesModule } from './modules/messages/messages.module';
import { SupportTicketsModule } from './modules/support-tickets/support-tickets.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { BlogPostsModule } from './modules/blog-posts/blog-posts.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ClientNote } from './modules/client-notes/entities/client-note.entity';
import { ClientInteractionsModule } from './modules/client-interactions/client-interactions.module';
import { QuestionsModule } from './modules/questions/questions.module'; 
import { AnswersModule } from './modules/answers/answers.module'; 
import { CaseStudiesModule } from './modules/case-studies/case-studies.module';
import { TestimonialsModule } from './modules/testimonials/testimonials.module';
import { ContactInquiriesModule } from './modules/contact-inquiries/contact-inquiries.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import databaseConfig from './config/database.config';
import { serialize } from 'v8';
import { Lead } from './modules/leads/entities/lead.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PermissionsModule,
    SkillsModule,
    EmployeeProfilesModule,
    ProjectsModule,
    ProjectMembersModule,
    TechnologiesModule,
    ProjectTechnologiesModule,
    ProjectClientsModule,
    ProjectMilestonesModule,
    ProjectUpdatesModule,
    ClientProjectsModule,
    TasksModule,
    TimeEntriesModule,
    ServicesModule,
    DevelopmentPlansModule,
    PlanFeaturesModule,
    ClientPlanQuotationsModule,
    InvoicesModule,
    PaymentsModule,
    ConversationsModule,
    MessagesModule,
    SupportTicketsModule,
    CategoriesModule,
    BlogPostsModule,
    LeadsModule,
    ClientNote,
    ClientInteractionsModule,
    QuestionsModule,
    AnswersModule,
    CaseStudiesModule,
    TestimonialsModule,
    ContactInquiriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }