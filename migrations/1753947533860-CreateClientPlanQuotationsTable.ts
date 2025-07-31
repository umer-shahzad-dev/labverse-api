import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientPlanQuotationsTable1753947533860 implements MigrationInterface {
    name = 'CreateClientPlanQuotationsTable1753947533860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."client_plan_quotations_status_enum" AS ENUM('Draft', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Revised', 'Archived')`);
        await queryRunner.query(`CREATE TABLE "client_plan_quotations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quotation_code" character varying NOT NULL, "quoted_price" numeric(12,2) NOT NULL DEFAULT '0', "status" "public"."client_plan_quotations_status_enum" NOT NULL DEFAULT 'Draft', "valid_until" TIMESTAMP, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "client_id" uuid NOT NULL, "development_plan_id" uuid NOT NULL, CONSTRAINT "UQ_4fbea47f203ba91e2259e6d9841" UNIQUE ("quotation_code"), CONSTRAINT "PK_c21f3375c097d3d578fb7557dd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_plan_quotations" ADD CONSTRAINT "FK_3cde9f6c92a3736d0a8d331cbb0" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_plan_quotations" ADD CONSTRAINT "FK_aa6e83670b1b76e6e6b6fdbfef8" FOREIGN KEY ("development_plan_id") REFERENCES "development_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_plan_quotations" DROP CONSTRAINT "FK_aa6e83670b1b76e6e6b6fdbfef8"`);
        await queryRunner.query(`ALTER TABLE "client_plan_quotations" DROP CONSTRAINT "FK_3cde9f6c92a3736d0a8d331cbb0"`);
        await queryRunner.query(`DROP TABLE "client_plan_quotations"`);
        await queryRunner.query(`DROP TYPE "public"."client_plan_quotations_status_enum"`);
    }

}
