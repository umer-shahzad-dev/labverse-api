import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuestionAndAnswerTables1754110422643 implements MigrationInterface {
    name = 'CreateQuestionAndAnswerTables1754110422643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "question_id" uuid NOT NULL, "author_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "questionId" uuid, "authorId" uuid, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "author_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "FK_eb21b7568b66f2fbc1d0f8c0ddd" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_ca251175a93ed97051be0df6e6f" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_ca251175a93ed97051be0df6e6f"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_eb21b7568b66f2fbc1d0f8c0ddd"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "answers"`);
    }

}
