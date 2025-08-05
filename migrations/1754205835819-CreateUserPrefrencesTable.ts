import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserPrefrencesTable1754205835819 implements MigrationInterface {
    name = 'CreateUserPrefrencesTable1754205835819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "theme" character varying NOT NULL DEFAULT 'light', "language" character varying NOT NULL DEFAULT 'en', "receive_notifications" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_458057fa75b66e68a275647da2" UNIQUE ("user_id"), CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_preference_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a32ebf09b0ac0b9a02139c1554f" UNIQUE ("user_preference_id")`);
        await queryRunner.query(`ALTER TABLE "user_preferences" ADD CONSTRAINT "FK_458057fa75b66e68a275647da2e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a32ebf09b0ac0b9a02139c1554f" FOREIGN KEY ("user_preference_id") REFERENCES "user_preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a32ebf09b0ac0b9a02139c1554f"`);
        await queryRunner.query(`ALTER TABLE "user_preferences" DROP CONSTRAINT "FK_458057fa75b66e68a275647da2e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a32ebf09b0ac0b9a02139c1554f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_preference_id"`);
        await queryRunner.query(`DROP TABLE "user_preferences"`);
    }

}
