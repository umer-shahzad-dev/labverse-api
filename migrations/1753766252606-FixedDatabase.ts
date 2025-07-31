import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedDatabase1753766252606 implements MigrationInterface {
    name = 'FixedDatabase1753766252606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."roles_name_enum" AS ENUM('admin', 'user', 'client')`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."roles_name_enum" NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "date_of_birth" date, "contact_number" character varying, "hire_date" date, "position" character varying, "department" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_986e309c16f09ce6cc47d674cf" UNIQUE ("user_id"), CONSTRAINT "PK_8481c6a4516f6589b23adf7fefa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_46800813f460eb131823371caee" UNIQUE ("name"), CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "technology_id" uuid NOT NULL, "assigned_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9ce440f9d20169452245a0ca6d9" UNIQUE ("project_id", "technology_id"), CONSTRAINT "PK_cc34b25cf29da1b16045af51fbb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_members_role_on_project_enum" AS ENUM('project_lead', 'developer', 'qa', 'designer', 'business_analyst', 'scrum_master', 'other')`);
        await queryRunner.query(`CREATE TABLE "project_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role_on_project" "public"."project_members_role_on_project_enum" NOT NULL DEFAULT 'developer', "assignment_date" date NOT NULL DEFAULT ('now'::text)::date, "end_date" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b3f491d3a3f986106d281d8eb4b" UNIQUE ("project_id", "user_id"), CONSTRAINT "PK_0b2f46f804be4aea9234c78bcc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "user_id" uuid NOT NULL, "assigned_at" date NOT NULL DEFAULT ('now'::text)::date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d2bc41d6b22bd689966e254b629" UNIQUE ("project_id", "user_id"), CONSTRAINT "PK_613232cacaca9da39aba24a7b02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "task_id" uuid NOT NULL, "author_id" uuid, CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('todo', 'in_progress', 'code_review', 'qa', 'blocked', 'done', 'archived')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high', 'urgent')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'todo', "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'medium', "due_date" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" uuid NOT NULL, "milestone_id" uuid, "assigned_to_user_id" uuid, "created_by_user_id" uuid, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_milestones_status_enum" AS ENUM('not_started', 'in_progress', 'completed', 'overdue', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "project_milestones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying, "due_date" date, "completed_date" date, "status" "public"."project_milestones_status_enum" NOT NULL DEFAULT 'not_started', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0c561300a12c6ba3ad793dff4b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_updates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "project_id" uuid NOT NULL, "user_id" uuid, "description" character varying NOT NULL, "update_date" date NOT NULL DEFAULT ('now'::text)::date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2093d4d18851bc0f6ec8b1197e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "start_date" date, "end_date" date, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'planning', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_user_id" uuid, CONSTRAINT "UQ_2187088ab5ef2a918473cb99007" UNIQUE ("name"), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "full_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "role_permissions" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "role_permissions" ("permission_id") `);
        await queryRunner.query(`CREATE TABLE "employee_profile_skills" ("employee_profile_id" uuid NOT NULL, "skill_id" uuid NOT NULL, CONSTRAINT "PK_458ec96f80508fdb98b503a209a" PRIMARY KEY ("employee_profile_id", "skill_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f73c1a81fdeca42863f3c2cbb" ON "employee_profile_skills" ("employee_profile_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_74a89689414e1d02cb8ee8145c" ON "employee_profile_skills" ("skill_id") `);
        await queryRunner.query(`ALTER TABLE "employee_profiles" ADD CONSTRAINT "FK_986e309c16f09ce6cc47d674cfe" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_f47224297940ea91297f9aaa898" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_technologies" ADD CONSTRAINT "FK_76db2dc46856d239349e74e761b" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_b5729113570c20c7e214cf3f58d" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_members" ADD CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_clients" ADD CONSTRAINT "FK_b99f3d906106dbc74621bce4511" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_clients" ADD CONSTRAINT "FK_e937b1182dfc72b07b32c760770" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD CONSTRAINT "FK_ba9e465cfc707006e60aae59946" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD CONSTRAINT "FK_76901a920ba9ec5be8dbd64d747" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_39abeb50240a7312a00786c9b24" FOREIGN KEY ("milestone_id") REFERENCES "project_milestones"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_27821ee30aa99daef697f21322c" FOREIGN KEY ("assigned_to_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_milestones" ADD CONSTRAINT "FK_4072d2ff8e9ee23e9e03e5f6721" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_updates" ADD CONSTRAINT "FK_80cfd62a1d7c871fa100645f427" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_updates" ADD CONSTRAINT "FK_b5bbfbb7b543d94953d6d5e10f8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_9b4b555ca01bd035b4879ed4fce" FOREIGN KEY ("created_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_profile_skills" ADD CONSTRAINT "FK_4f73c1a81fdeca42863f3c2cbba" FOREIGN KEY ("employee_profile_id") REFERENCES "employee_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "employee_profile_skills" ADD CONSTRAINT "FK_74a89689414e1d02cb8ee8145c9" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_profile_skills" DROP CONSTRAINT "FK_74a89689414e1d02cb8ee8145c9"`);
        await queryRunner.query(`ALTER TABLE "employee_profile_skills" DROP CONSTRAINT "FK_4f73c1a81fdeca42863f3c2cbba"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_9b4b555ca01bd035b4879ed4fce"`);
        await queryRunner.query(`ALTER TABLE "project_updates" DROP CONSTRAINT "FK_b5bbfbb7b543d94953d6d5e10f8"`);
        await queryRunner.query(`ALTER TABLE "project_updates" DROP CONSTRAINT "FK_80cfd62a1d7c871fa100645f427"`);
        await queryRunner.query(`ALTER TABLE "project_milestones" DROP CONSTRAINT "FK_4072d2ff8e9ee23e9e03e5f6721"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_932b7ae90148e482bc27b0a6d65"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_27821ee30aa99daef697f21322c"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_39abeb50240a7312a00786c9b24"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_76901a920ba9ec5be8dbd64d747"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_ba9e465cfc707006e60aae59946"`);
        await queryRunner.query(`ALTER TABLE "project_clients" DROP CONSTRAINT "FK_e937b1182dfc72b07b32c760770"`);
        await queryRunner.query(`ALTER TABLE "project_clients" DROP CONSTRAINT "FK_b99f3d906106dbc74621bce4511"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_e89aae80e010c2faa72e6a49ce8"`);
        await queryRunner.query(`ALTER TABLE "project_members" DROP CONSTRAINT "FK_b5729113570c20c7e214cf3f58d"`);
        await queryRunner.query(`ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_76db2dc46856d239349e74e761b"`);
        await queryRunner.query(`ALTER TABLE "project_technologies" DROP CONSTRAINT "FK_f47224297940ea91297f9aaa898"`);
        await queryRunner.query(`ALTER TABLE "employee_profiles" DROP CONSTRAINT "FK_986e309c16f09ce6cc47d674cfe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74a89689414e1d02cb8ee8145c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f73c1a81fdeca42863f3c2cbb"`);
        await queryRunner.query(`DROP TABLE "employee_profile_skills"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17022daf3f885f7d35423e9971"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_178199805b901ccd220ab7740e"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "project_updates"`);
        await queryRunner.query(`DROP TABLE "project_milestones"`);
        await queryRunner.query(`DROP TYPE "public"."project_milestones_status_enum"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "task_comments"`);
        await queryRunner.query(`DROP TABLE "project_clients"`);
        await queryRunner.query(`DROP TABLE "project_members"`);
        await queryRunner.query(`DROP TYPE "public"."project_members_role_on_project_enum"`);
        await queryRunner.query(`DROP TABLE "project_technologies"`);
        await queryRunner.query(`DROP TABLE "technologies"`);
        await queryRunner.query(`DROP TABLE "employee_profiles"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TYPE "public"."roles_name_enum"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
