import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany, // For relationship with Project, will be defined later
} from 'typeorm';
import { ProjectTechnology } from '../../project-technologies/entities/project-technology.entity';
import { DevelopmentPlanTechnology } from '../../development-plans/entities/development-plan-technology.entity';
// import { Project } from '../../projects/entities/project.entity'; // Will be imported and used later

@Entity({ name: 'technologies' })
export class Technology {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // E.g., "Node.js", "React", "PostgreSQL"

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => ProjectTechnology, (projectTechnology) => projectTechnology.technology)
    projects: ProjectTechnology[];

    @OneToMany(() => DevelopmentPlanTechnology, (dpt) => dpt.technology)
    developmentPlanTechnologies: DevelopmentPlanTechnology[];

    // Many-to-many relationship with Project (will be fully defined later with a join table)
    // @ManyToMany(() => Project, (project) => project.technologies)
    // projects: Project[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}