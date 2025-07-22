import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndRoles1689774123456 implements MigrationInterface {
  name = 'CreateUsersAndRoles1689774123456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid-ossp and pgcrypto extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create roles table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add index for fast search on role name
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );
    `);

    // Add indexes for users
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in order to not break FK constraints
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_role_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_users_email;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_roles_name;`);
    await queryRunner.query(`DROP TABLE IF EXISTS roles;`);

    // Optionally, do NOT drop the pgcrypto extension as it may be shared
    // await queryRunner.query(`DROP EXTENSION IF EXISTS "pgcrypto";`);
  }
}
