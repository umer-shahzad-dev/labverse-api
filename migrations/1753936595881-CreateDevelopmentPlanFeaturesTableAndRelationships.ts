import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDevelopmentPlanFeaturesTableAndRelationships1753936595881 implements MigrationInterface {
    name = 'CreateDevelopmentPlanFeaturesTableAndRelationships1753936595881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "development_plan_features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price_adjustment" numeric(10,2) DEFAULT '0', "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "development_plan_id" uuid NOT NULL, "plan_feature_id" uuid NOT NULL, CONSTRAINT "UQ_90fdab6286c093e58b2474fa242" UNIQUE ("development_plan_id", "plan_feature_id"), CONSTRAINT "PK_73e554d273c269d378bf2ebd3b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "development_plan_features" ADD CONSTRAINT "FK_a477df12853cef10eb397aacab1" FOREIGN KEY ("development_plan_id") REFERENCES "development_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "development_plan_features" ADD CONSTRAINT "FK_98aaa63e456cb67cfc6ac004af1" FOREIGN KEY ("plan_feature_id") REFERENCES "plan_features"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "development_plan_features" DROP CONSTRAINT "FK_98aaa63e456cb67cfc6ac004af1"`);
        await queryRunner.query(`ALTER TABLE "development_plan_features" DROP CONSTRAINT "FK_a477df12853cef10eb397aacab1"`);
        await queryRunner.query(`DROP TABLE "development_plan_features"`);
    }

}
