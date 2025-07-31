import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from 'typeorm';
import { EmployeeProfile } from '../../employee-profiles/entities/employee-profile.entity'; // Will be created later

@Entity({ name: 'skills' })
export class Skill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    // This will be used when we create the EmployeeProfile entity
    @ManyToMany(() => EmployeeProfile, employeeProfile => employeeProfile.skills)
    employeeProfiles: EmployeeProfile[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}