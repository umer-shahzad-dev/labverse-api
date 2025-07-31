import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlanFeaturesTable1753934856619 implements MigrationInterface {
    name = 'CreatePlanFeaturesTable1753934856619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "default_price_adjustment" numeric(10,2) DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_0f6225ee150034397941c549203" UNIQUE ("name"), CONSTRAINT "PK_eb2b32d1d93a8b2e96e122e3a77" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "plan_features"`);
    }

}
