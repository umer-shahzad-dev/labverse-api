import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { Lead } from './entities/lead.entity';
import { User } from '../users/entities/user.entity';
import { LeadsController } from './leads.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Lead, User])],
    providers: [LeadsService],
    controllers: [LeadsController],
})
export class LeadsModule { }