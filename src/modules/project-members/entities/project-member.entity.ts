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
import { User } from '../../users/entities/user.entity';

export enum ProjectRole {
    PROJECT_LEAD = 'project_lead',
    DEVELOPER = 'developer',
    QA = 'qa',
    DESIGNER = 'designer',
    BUSINESS_ANALYST = 'business_analyst',
    SCRUM_MASTER = 'scrum_master',
    OTHER = 'other',
}

@Entity({ name: 'project_members' })
@Unique(['projectId', 'userId']) // Ensures a user can only be assigned to a specific project once
export class ProjectMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string; // Foreign key to Project

    @Column({ name: 'user_id' })
    userId: string; // Foreign key to User

    @ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @ManyToOne(() => User, (user) => user.projectMembers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'enum', enum: ProjectRole, default: ProjectRole.DEVELOPER, name: 'role_on_project' })
    roleOnProject: ProjectRole;

    @Column({ type: 'date', name: 'assignment_date', default: () => 'CURRENT_DATE' })
    assignmentDate: Date;

    @Column({ type: 'date', name: 'end_date', nullable: true })
    endDate: Date; // When the member's assignment to this project ended

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}