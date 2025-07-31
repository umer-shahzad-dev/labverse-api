import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { Skill } from './entities/skill.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Skill])],
    controllers: [SkillsController],
    providers: [SkillsService],
    exports: [SkillsService], // Export SkillsService if other modules need to use it
})
export class SkillsModule { }