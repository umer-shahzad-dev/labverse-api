import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDevelopmentPlanServicesTable1753937804109 implements MigrationInterface {
    name = 'CreateDevelopmentPlanServicesTable1753937804109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "development_plan_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "custom_price" numeric(10,2), "quantity" numeric(10,2), "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "development_plan_id" uuid NOT NULL, "service_id" uuid NOT NULL, CONSTRAINT "UQ_9fdab8e7d166337dc2854952a19" UNIQUE ("development_plan_id", "service_id"), CONSTRAINT "PK_f797b5a477ef98488cdeea492ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "development_plan_services" ADD CONSTRAINT "FK_9bb3818db783c8ab454ac3d7709" FOREIGN KEY ("development_plan_id") REFERENCES "development_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "development_plan_services" ADD CONSTRAINT "FK_b3b17a723cfe7289e34fea45fb3" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "development_plan_services" DROP CONSTRAINT "FK_b3b17a723cfe7289e34fea45fb3"`);
        await queryRunner.query(`ALTER TABLE "development_plan_services" DROP CONSTRAINT "FK_9bb3818db783c8ab454ac3d7709"`);
        await queryRunner.query(`DROP TABLE "development_plan_services"`);
    }

}
