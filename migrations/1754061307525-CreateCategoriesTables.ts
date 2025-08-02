import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriesTables1754061307525 implements MigrationInterface {
    name = 'CreateCategoriesTables1754061307525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
