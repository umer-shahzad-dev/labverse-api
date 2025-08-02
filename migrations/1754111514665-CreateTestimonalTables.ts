import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTestimonalTables1754111514665 implements MigrationInterface {
    name = 'CreateTestimonalTables1754111514665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "testimonials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "author_name" character varying NOT NULL, "author_title" character varying, "created_by_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "createdById" uuid, CONSTRAINT "PK_63b03c608bd258f115a0a4a1060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "testimonials" ADD CONSTRAINT "FK_9bd567ac53298ca29a610eac34e" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "testimonials" DROP CONSTRAINT "FK_9bd567ac53298ca29a610eac34e"`);
        await queryRunner.query(`DROP TABLE "testimonials"`);
    }

}
