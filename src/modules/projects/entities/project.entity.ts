import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
} from 'typeorm';
import { ProjectTechnology } from '../../project-technologies/entities/project-technology.entity';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from '../../project-members/entities/project-member.entity';
import { Technology } from '../../technologies/entities/technology.entity'; // Will be created later
import { ProjectClient } from '../../project-clients/entities/project-client.entity';
import { ProjectMilestone } from '../../project-milestones/entities/project-milestone.entity';
import { ProjectUpdate } from '../../project-updates/entities/project-update.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';

export enum ProjectStatus {
    PLANNING = 'planning',
    ACTIVE = 'active',
    ON_HOLD = 'on_hold',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'date', name: 'start_date', nullable: true })
    startDate: Date;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: Date;

    @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
    status: ProjectStatus;

    @ManyToOne(() => User, (user) => user.createdProjects, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'created_by_user_id' })
    createdBy: User;

    @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
    members: ProjectMember[];

    @OneToMany(() => ProjectTechnology, (projectTechnology) => projectTechnology.project)
    technologies: ProjectTechnology[];

    @OneToMany(() => ProjectClient, (projectClient) => projectClient.project)
    clients: ProjectClient[];

    @OneToMany(() => ProjectMilestone, (projectMilestone) => projectMilestone.project)
    milestones: ProjectMilestone[];

    @OneToMany(() => ProjectUpdate, (projectUpdate) => projectUpdate.project)
    updates: ProjectUpdate[];

    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[]; // Now correctly typed

    // @ManyToMany(() => Technology, (technology) => technology.projects)
    // technologies: Technology[];


    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.project) 
    timeEntries: TimeEntry[];
}