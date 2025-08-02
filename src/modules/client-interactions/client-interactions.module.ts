import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientInteractionsService } from './client-interactions.service';
import { ClientInteraction } from './entities/client-interaction.entity';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';
import { ClientInteractionsController } from './client-interactions.controller';    

@Module({
    imports: [TypeOrmModule.forFeature([ClientInteraction, User, Lead])],
    providers: [ClientInteractionsService],
     controllers: [ClientInteractionsController], 
})
export class ClientInteractionsModule { }