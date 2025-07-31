import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import * as bcrypt from 'bcryptjs'; // Use bcryptjs as per your package.json
import * as dotenv from 'dotenv'; // Import dotenv

// Import all entities and enums that might be referenced or seeded
import { Role } from '../src/modules/roles/entities/role.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { Permission } from '../src/modules/permissions/entities/permission.entity';
import { RoleEnum } from '../src/modules/roles/role.enum';
import { Project } from '../src/modules/projects/entities/project.entity';
import { ProjectClient } from '../src/modules/project-clients/entities/project-client.entity';
import { ProjectMember } from '../src/modules/project-members/entities/project-member.entity';
import { Technology } from '../src/modules/technologies/entities/technology.entity';
import { ProjectTechnology } from '../src/modules/project-technologies/entities/project-technology.entity';
import { EmployeeProfile } from '../src/modules/employee-profiles/entities/employee-profile.entity';
import { Skill } from '../src/modules/skills/entities/skill.entity';
import { ProjectMilestone } from '../src/modules/project-milestones/entities/project-milestone.entity';
import { ProjectUpdate } from '../src/modules/project-updates/entities/project-update.entity';
import { ProjectStatus } from '../src/modules/projects/entities/project.entity';

// Import your database config
import databaseConfig from '../src/config/database.config';

dotenv.config(); // Load environment variables


async function seed() {
  await AppDataSource.initialize();
  console.log('Database connection established for seeding...');

  // Get all necessary repositories
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const permissionRepo = AppDataSource.getRepository(Permission);
  const projectRepo = AppDataSource.getRepository(Project);
  const projectClientRepo = AppDataSource.getRepository(ProjectClient);
  // Add other repositories if you plan to seed data for them here
  const projectMemberRepo = AppDataSource.getRepository(ProjectMember);
  const technologyRepo = AppDataSource.getRepository(Technology);
  const projectTechnologyRepo = AppDataSource.getRepository(ProjectTechnology);
  const employeeProfileRepo = AppDataSource.getRepository(EmployeeProfile);
  const skillRepo = AppDataSource.getRepository(Skill);
  const projectMilestoneRepo = AppDataSource.getRepository(ProjectMilestone);
  const projectUpdateRepo = AppDataSource.getRepository(ProjectUpdate);


  try {
    // 1. Seed Permissions first
    const permissionsToSeed = [
      { name: 'manage_users', description: 'Allows management of all user accounts.' },
      { name: 'create_projects', description: 'Allows creation of new projects.' },
      { name: 'view_projects', description: 'Allows viewing of all projects.' }, // Existing, useful for general users
      { name: 'manage_roles', description: 'Allows creation and modification of roles.' },
      { name: 'manage_permissions', description: 'Allows management of system permissions.' },
      { name: 'manage_skills', description: 'Allows management of skills.' },
      { name: 'manage_employee_profiles', description: 'Allows management of employee profiles.' },
      { name: 'manage_projects', description: 'Allows full CRUD for projects.' },
      { name: 'manage_project_members', description: 'Allows management of project member assignments and roles.' },
      { name: 'manage_technologies', description: 'Allows full CRUD for technologies.' },
      { name: 'manage_project_technologies', description: 'Allows management of technologies assigned to projects.' },
      { name: 'manage_project_clients', description: 'Allows management of clients assigned to projects.' },
      { name: 'manage_project_milestones', description: 'Allows management of project milestones.' },
      { name: 'manage_project_updates', description: 'Allows management of project updates.' },
      { name: 'view_client_projects', description: 'Allows a client to view their assigned projects and related progress.' }, // NEW CLIENT PERMISSION
      { name: 'view_profile', description: 'Allows a user to view their own profile.' },
      { name: 'view_skills', description: 'Allows a user to view skills.' },
      // Task Permissions
      { name: 'create_task', description: 'Allows creating new tasks' },
      { name: 'read_task', description: 'Allows viewing tasks' },
      { name: 'update_task', description: 'Allows updating task details (name, description, due date, project, milestone)' },
      { name: 'delete_task', description: 'Allows deleting tasks' },
      { name: 'assign_task', description: 'Allows assigning tasks to users' },
      { name: 'update_task_status', description: 'Allows updating task status' },
      { name: 'update_task_priority', description: 'Allows updating task priority' },

      // Task Comment Permissions
      { name: 'create_task_comment', description: 'Allows adding comments to tasks' },
      { name: 'read_task_comment', description: 'Allows viewing task comments' },
      { name: 'update_task_comment', description: 'Allows updating own task comments' },
      { name: 'delete_task_comment', description: 'Allows deleting own task comments' },

      { name: 'create_time_entry', description: 'Allows creating time entries' },
      { name: 'read_time_entry', description: 'Allows reading time entries' },
      { name: 'update_time_entry', description: 'Allows updating time entries' },
      { name: 'delete_time_entry', description: 'Allows deleting time entries' },
      { name: 'read_time_entry_report', description: 'Allows reading time reports' },

      { name: 'create_service', description: 'Allows creating new services' },
      { name: 'read_service', description: 'Allows reading service details' },
      { name: 'update_service', description: 'Allows updating existing services' },
      { name: 'delete_service', description: 'Allows deleting services' },

      { name: 'create_development_plan', description: 'Allows creating new development plans' },
      { name: 'read_development_plan', description: 'Allows reading development plan details' },
      { name: 'update_development_plan', description: 'Allows updating existing development plans' },
      { name: 'delete_development_plan', description: 'Allows deleting development plans' },

      { name: 'create_plan_feature', description: 'Allows creating new plan features' },
      { name: 'read_plan_feature', description: 'Allows reading plan feature details' },
      { name: 'update_plan_feature', description: 'Allows updating existing plan features' },
      { name: 'delete_plan_feature', description: 'Allows deleting plan features' },

      { name: 'create_development_plan_feature', description: 'Allows associating features with development plans' },
      { name: 'read_development_plan_feature', description: 'Allows reading development plan feature associations' },
      { name: 'update_development_plan_feature', description: 'Allows updating development plan feature associations' },
      { name: 'delete_development_plan_feature', description: 'Allows deleting development plan feature associations' },

      { name: 'create_development_plan_service', description: 'Allows associating services with development plans' },
      { name: 'read_development_plan_service', description: 'Allows reading development plan service associations' },
      { name: 'update_development_plan_service', description: 'Allows updating development plan service associations' },
      { name: 'delete_development_plan_service', description: 'Allows deleting development plan service associations' },

      { name: 'create_development_plan_technology', description: 'Allows associating technologies with development plans' },
      { name: 'read_development_plan_technology', description: 'Allows reading development plan technology associations' },
      { name: 'update_development_plan_technology', description: 'Allows updating development plan technology associations' },
      { name: 'delete_development_plan_technology', description: 'Allows deleting development plan technology associations' },

      { name: 'create_client_plan_quotation', description: 'Allows creating new client plan quotations' },
      { name: 'read_client_plan_quotation', description: 'Allows reading client plan quotation details' },
      { name: 'update_client_plan_quotation', description: 'Allows updating existing client plan quotations' },
      { name: 'delete_client_plan_quotation', description: 'Allows deleting client plan quotations' },
      { name: 'update_client_plan_quotation_status', description: 'Allows updating the status of client plan quotations' }, // Specific status permission

    ];

    const seededPermissions: { [key: string]: Permission } = {};
    for (const permData of permissionsToSeed) {
      let permission = await permissionRepo.findOne({ where: { name: permData.name } });
      if (!permission) {
        permission = permissionRepo.create(permData);
        await permissionRepo.save(permission);
        console.log(`Permission "${permData.name}" created.`);
      } else {
        console.log(`Permission "${permData.name}" already exists.`);
      }
      seededPermissions[permData.name] = permission;
    }

    // 2. Seed Roles and link them to Permissions
    const adminRoleData = { name: RoleEnum.ADMIN, description: 'Administrator with full access' };
    const adminPermissions = Object.values(seededPermissions); // Assign all permissions to Admin

    let adminRole = await roleRepo.findOne({ where: { name: adminRoleData.name }, relations: ['permissions'] });
    if (!adminRole) {
      adminRole = roleRepo.create({ ...adminRoleData, permissions: adminPermissions });
      await roleRepo.save(adminRole);
      console.log(`Role "${adminRoleData.name}" created with all permissions.`);
    } else {
      const currentPermNames = adminRole.permissions.map(p => p.name);
      const newPermNames = adminPermissions.map(p => p.name);
      if (JSON.stringify([...currentPermNames].sort()) !== JSON.stringify([...newPermNames].sort())) {
        adminRole.permissions = adminPermissions;
        await roleRepo.save(adminRole);
        console.log(`Role "${adminRoleData.name}" permissions updated.`);
      } else {
        console.log(`Role "${adminRoleData.name}" already exists with correct permissions.`);
      }
    }

    const userRoleData = { name: RoleEnum.USER, description: 'Default user' };
    const userRolePermissions = [
      seededPermissions['view_projects'],
      seededPermissions['view_profile'],
      seededPermissions['view_skills']
    ].filter(Boolean); // Filter out any undefined permissions

    let userRole = await roleRepo.findOne({ where: { name: userRoleData.name }, relations: ['permissions'] });
    if (!userRole) {
      userRole = roleRepo.create({ ...userRoleData, permissions: userRolePermissions });
      await roleRepo.save(userRole);
      console.log(`Role "${userRoleData.name}" created with limited permissions.`);
    } else {
      const currentUserPermNames = userRole.permissions.map(p => p.name);
      const newUserPermNames = userRolePermissions.map(p => p.name);
      if (JSON.stringify([...currentUserPermNames].sort()) !== JSON.stringify([...newUserPermNames].sort())) {
        userRole.permissions = userRolePermissions;
        await roleRepo.save(userRole);
        console.log(`Role "${userRoleData.name}" permissions updated.`);
      } else {
        console.log(`Role "${userRoleData.name}" already exists with correct permissions.`);
      }
    }

    const clientRoleData = { name: RoleEnum.CLIENT, description: 'Client role with limited project view access.' }; // Define Client Role
    const clientRolePermissions = [
      seededPermissions['view_client_projects'],
      seededPermissions['view_profile'],
      seededPermissions['view_skills']
    ].filter(Boolean); // Filter out any undefined permissions

    let clientRole = await roleRepo.findOne({ where: { name: clientRoleData.name }, relations: ['permissions'] });
    if (!clientRole) {
      clientRole = roleRepo.create({ ...clientRoleData, permissions: clientRolePermissions });
      await roleRepo.save(clientRole);
      console.log(`Role "${clientRoleData.name}" created with client-specific permissions.`);
    } else {
      const currentClientPermNames = clientRole.permissions.map(p => p.name);
      const newClientPermNames = clientRolePermissions.map(p => p.name);
      if (JSON.stringify([...currentClientPermNames].sort()) !== JSON.stringify([...newClientPermNames].sort())) {
        clientRole.permissions = clientRolePermissions;
        await roleRepo.save(clientRole);
        console.log(`Role "${clientRoleData.name}" permissions updated.`);
      } else {
        console.log(`Role "${clientRoleData.name}" already exists with correct permissions.`);
      }
    }


    // 3. Seed Users
    // Admin User
    const adminEmail = 'admin@labverse.com';
    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      adminUser = userRepo.create({
        email: adminEmail,
        password: hashedPassword,
        fullName: 'Labverse Admin',
        role: adminRole,
      });
      await userRepo.save(adminUser);
      console.log(`Admin user "${adminEmail}" created.`);
    } else {
      console.log(`Admin user "${adminEmail}" already exists.`);
    }

    // Client User
    const clientEmail = 'client@example.com';
    let clientUser = await userRepo.findOne({ where: { email: clientEmail } });
    if (!clientUser) {
      const hashedPassword = await bcrypt.hash('Client@123', 10); // Stronger password
      clientUser = userRepo.create({
        email: clientEmail,
        password: hashedPassword,
        fullName: 'Client One',
        role: clientRole, // Assign the Client role
      });
      await userRepo.save(clientUser);
      console.log(`Client user "${clientEmail}" created.`);
    } else {
      console.log(`Client user "${clientEmail}" already exists.`);
    }

    // Regular User
    const regularUserEmail = 'user@example.com';
    let regularUser = await userRepo.findOne({ where: { email: regularUserEmail } });
    if (!regularUser) {
      const hashedPassword = await bcrypt.hash('User@123', 10); // Stronger password
      regularUser = userRepo.create({
        email: regularUserEmail,
        password: hashedPassword,
        fullName: 'Regular User',
        role: userRole, // Assign the User role
      });
      await userRepo.save(regularUser);
      console.log(`Regular user "${regularUserEmail}" created.`);
    } else {
      console.log(`Regular user "${regularUserEmail}" already exists.`);
    }


    // 4. Seed a Project (if needed for association)
    const projectName = 'Client Project Alpha';
    let clientProject = await projectRepo.findOne({ where: { name: projectName } });
    if (!clientProject) {
      clientProject = projectRepo.create({
        name: projectName,
        description: 'A project specifically for client testing.',
        status: ProjectStatus.ACTIVE,
        startDate: new Date(),
        createdBy: adminUser, // Admin creates the project
      });
      await projectRepo.save(clientProject);
      console.log(`Project "${projectName}" created.`);
    } else {
      console.log(`Project "${projectName}" already exists.`);
    }

    // 5. Associate Client User with the Project
    if (clientProject && clientUser) {
      let existingProjectClient = await projectClientRepo.findOne({
        where: { projectId: clientProject.id, userId: clientUser.id },
      });
      if (!existingProjectClient) {
        const projectClient = projectClientRepo.create({
          project: clientProject,
          user: clientUser,
          assignedAt: new Date(),
        });
        await projectClientRepo.save(projectClient);
        console.log(`Client "${clientUser.fullName}" associated with Project "${clientProject.name}".`);
      } else {
        console.log(`Client "${clientUser.fullName}" already associated with Project "${clientProject.name}".`);
      }
    }

    // You can add more seeding logic here for skills, employee profiles, project members, etc.
    // Example: Seed a skill and associate it with an employee profile
    // const devSkill = await skillRepo.findOne({ where: { name: 'Node.js' } });
    // if (!devSkill) {
    //   const newSkill = skillRepo.create({ name: 'Node.js', description: 'Backend development with Node.js' });
    //   await skillRepo.save(newSkill);
    // }

    console.log('Database seeding completed.');

  } catch (e) {
    console.error('Seeding error:', e);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

seed().catch((e) => {
  console.error('An error occurred during the seeding process:', e);
  process.exit(1);
});