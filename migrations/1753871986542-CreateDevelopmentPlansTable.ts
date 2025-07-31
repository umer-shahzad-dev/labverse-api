import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDevelopmentPlansTable1753871986542 implements MigrationInterface {
    name = 'CreateDevelopmentPlansTable1753871986542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "development_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "base_price" numeric(10,2) NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_43d5007fac5486361011dde275f" UNIQUE ("name"), CONSTRAINT "PK_86c30a1eb9f93130880d954d587" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "development_plans"`);
    }

}
