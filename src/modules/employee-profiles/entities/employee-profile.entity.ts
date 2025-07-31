import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Entity({ name: 'employee_profiles' })
export class EmployeeProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.employeeProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'first_name', nullable: true })
    firstName: string;

    @Column({ name: 'last_name', nullable: true })
    lastName: string;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ name: 'contact_number', nullable: true })
    contactNumber: string;

    @Column({ name: 'hire_date', type: 'date', nullable: true })
    hireDate: Date;

    @Column({ nullable: true })
    position: string; // e.g., "Software Engineer", "Project Manager"

    @Column({ nullable: true })
    department: string; // e.g., "Engineering", "HR"

    @ManyToMany(() => Skill, (skill) => skill.employeeProfiles, { cascade: true })
    @JoinTable({
        name: 'employee_profile_skills',
        joinColumn: { name: 'employee_profile_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    })
    skills: Skill[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}