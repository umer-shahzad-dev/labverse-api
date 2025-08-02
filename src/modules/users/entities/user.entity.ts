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
import { ConversationParticipant } from '../../conversations/entities/conversation-participant.entity';
import { Message } from '../../messages/entities/message.entity';
import { SupportTicket } from '../../support-tickets/entities/support-ticket.entity';
import { TicketComment } from '../../support-tickets/entities/ticket-comment.entity';
import { BlogPost } from '../../blog-posts/entities/blog-post.entity';
import { Comment } from '../../blog-posts/entities/comment.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { ClientNote } from '../../client-notes/entities/client-note.entity';
import { ClientInteraction } from '../../client-interactions/entities/client-interaction.entity';
import { Question } from '../../questions/entities/question.entity'; 
import { Answer } from '../../answers/entities/answer.entity';

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

  @OneToMany(() => ConversationParticipant, (participant) => participant.user)
  conversationParticipants: ConversationParticipant[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => SupportTicket, ticket => ticket.reporter)
  reportedTickets: SupportTicket[];

  @OneToMany(() => SupportTicket, ticket => ticket.assignedTo)
  assignedTickets: SupportTicket[];

  @OneToMany(() => TicketComment, comment => comment.author)
  ticketComments: TicketComment[];

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogPosts: BlogPost[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Lead, (lead) => lead.assignedTo)
  leads: Lead[];


  @OneToMany(() => ClientNote, (note) => note.author)
  authoredNotes: ClientNote[];

  @OneToMany(() => ClientNote, (note) => note.client)
  clientNotes: ClientNote[];

  @OneToMany(() => ClientInteraction, (interaction) => interaction.loggedBy)
  loggedInteractions: ClientInteraction[];

  @OneToMany(() => ClientInteraction, (interaction) => interaction.interactedWith)
  clientInteractions: ClientInteraction[];

  @OneToMany(() => Question, (question) => question.author)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.author)
  answers: Answer[];

}
