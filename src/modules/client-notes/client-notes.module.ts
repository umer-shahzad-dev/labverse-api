import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientNotesService } from './client-notes.service';
import { ClientNote } from './entities/client-note.entity';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';
import { ClientNotesController } from './client-notes.controller';
@Module({
    imports: [TypeOrmModule.forFeature([ClientNote, User, Lead])],
    providers: [ClientNotesService],
    controllers: [ClientNotesController],
})
export class ClientNotesModule { }