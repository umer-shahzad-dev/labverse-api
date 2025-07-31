import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { EmployeeProfile } from '../../employee-profiles/entities/employee-profile.entity';
import { Project } from '../../projects/entities/project.entity';
import { ProjectMember } from '../../project-members/entities/project-member.entity';
import { ProjectClient } from '../../project-clients/entities/project-client.entity';
import { ProjectUpdate } from '../../project-updates/entities/project-update.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TaskComment } from '../../tasks/entities/task-comment.entity';
import { TimeEntry } from '../../time-entries/entities/time-entry.entity';
import { ClientPlanQuotation } from '../../client-plan-quotations/entities/client-plan-quotation.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => EmployeeProfile, (employeeProfile) => employeeProfile.user)
  employeeProfile: EmployeeProfile;

  @OneToMany(() => Project, (project) => project.createdBy)
  createdProjects: Project[];

  @OneToMany(() => ProjectMember, (projectMember) => projectMember.user)
  projectMembers: ProjectMember[];

  @OneToMany(() => ProjectClient, (projectClient) => projectClient.user)
  clientProjects: ProjectClient[];

  @OneToMany(() => ProjectUpdate, (projectUpdate) => projectUpdate.user)
  projectUpdates: ProjectUpdate[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  assignedTasks: Task[]; // Now correctly typed

  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks: Task[]; // Now correctly typed

  @OneToMany(() => TaskComment, (taskComment) => taskComment.author)
  taskComments: TaskComment[]; // Now correctly typed

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TimeEntry, (timeEntry) => timeEntry.user)
  timeEntries: TimeEntry[];

  @OneToMany(() => ClientPlanQuotation, (quote) => quote.client)
  clientQuotations: ClientPlanQuotation[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];
}
