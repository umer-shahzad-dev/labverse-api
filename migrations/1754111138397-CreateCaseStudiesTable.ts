import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCaseStudiesTable1754111138397 implements MigrationInterface {
    name = 'CreateCaseStudiesTable1754111138397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "case_studies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "summary" text NOT NULL, "content" text NOT NULL, "author_id" uuid, "category_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "categoryId" uuid, CONSTRAINT "PK_18a30cb83a1df4d8df5ddc6b39e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "case_studies" ADD CONSTRAINT "FK_3f1fae2b6baee86e12fa1d8abeb" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "case_studies" ADD CONSTRAINT "FK_fd5eae995ad2a00ce682c08711c" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "case_studies" DROP CONSTRAINT "FK_fd5eae995ad2a00ce682c08711c"`);
        await queryRunner.query(`ALTER TABLE "case_studies" DROP CONSTRAINT "FK_3f1fae2b6baee86e12fa1d8abeb"`);
        await queryRunner.query(`DROP TABLE "case_studies"`);
    }

}
