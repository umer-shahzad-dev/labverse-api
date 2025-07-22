import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Role } from '../src/modules/roles/entities/role.entity';
import { User } from '../src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from 'src/modules/roles/role.enum';

async function seed() {
  await AppDataSource.initialize();

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);

  // Seed roles
  const rolesToSeed = [
    { name: RoleEnum.ADMIN, description: 'Administrator with full access' },
    { name: RoleEnum.USER, description: 'Default user' },
  ];

  for (const roleData of rolesToSeed) {
    let role = await roleRepo.findOne({ where: { name: roleData.name } });
    if (!role) {
      role = roleRepo.create(roleData);
      await roleRepo.save(role);
      console.log(`Role "${roleData.name}" created.`);
    } else {
      console.log(`Role "${roleData.name}" already exists.`);
    }
  }

  // Seed admin user
  const adminEmail = 'admin@labverse.org';
  let adminUser = await userRepo.findOne({ where: { email: adminEmail } });

  if (!adminUser) {
    const adminRole = await roleRepo.findOne({
      where: { name: RoleEnum.ADMIN },
    });
    const password = await bcrypt.hash('Admin@12345', 10); // Use env or config for real projects!
    adminUser = userRepo.create({
      email: adminEmail,
      password,
      fullName: 'Super Admin',
      role: adminRole,
    });
    await userRepo.save(adminUser);
    console.log(
      `Admin user "${adminEmail}" created with password: Admin@12345`,
    );
  } else {
    console.log(`Admin user "${adminEmail}" already exists.`);
  }

  await AppDataSource.destroy();
  process.exit(0);
}

seed().catch((e) => {
  console.error('Seeding error:', e);
  process.exit(1);
});
