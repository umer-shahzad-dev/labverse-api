import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlanJunctionTablesAndRelationships1753938944435 implements MigrationInterface {
    name = 'CreatePlanJunctionTablesAndRelationships1753938944435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "development_plan_technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "development_plan_id" uuid NOT NULL, "technology_id" uuid NOT NULL, CONSTRAINT "UQ_77827d3a5795ae0bb71db52904f" UNIQUE ("development_plan_id", "technology_id"), CONSTRAINT "PK_30b801edd03bc4991f339691b07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "development_plan_technologies" ADD CONSTRAINT "FK_12e1304e70ec50eaf823a823698" FOREIGN KEY ("development_plan_id") REFERENCES "development_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "development_plan_technologies" ADD CONSTRAINT "FK_cfea535707a5455eb37ece66990" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "development_plan_technologies" DROP CONSTRAINT "FK_cfea535707a5455eb37ece66990"`);
        await queryRunner.query(`ALTER TABLE "development_plan_technologies" DROP CONSTRAINT "FK_12e1304e70ec50eaf823a823698"`);
        await queryRunner.query(`DROP TABLE "development_plan_technologies"`);
    }

}
