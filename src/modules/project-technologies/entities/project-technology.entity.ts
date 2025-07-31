import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Technology } from '../../technologies/entities/technology.entity';

@Entity({ name: 'project_technologies' })
@Unique(['projectId', 'technologyId']) // Ensures a technology can only be assigned to a specific project once
export class ProjectTechnology {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string; // Foreign key to Project

    @Column({ name: 'technology_id' })
    technologyId: string; // Foreign key to Technology

    @ManyToOne(() => Project, (project) => project.technologies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => Technology, (technology) => technology.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'technology_id' })
    technology: Technology;

    @CreateDateColumn({ name: 'assigned_at' })
    assignedAt: Date; // When this technology was assigned to the project

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}