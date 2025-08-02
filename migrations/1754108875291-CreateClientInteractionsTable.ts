import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientInteractionsTable1754108875291 implements MigrationInterface {
    name = 'CreateClientInteractionsTable1754108875291'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "client_notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "author_id" uuid NOT NULL, "client_id" uuid, "lead_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "clientId" uuid, "leadId" uuid, CONSTRAINT "PK_50a5ba00f574738e3359f85956a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."client_interactions_type_enum" AS ENUM('email', 'phone_call', 'meeting', 'note', 'support_ticket')`);
        await queryRunner.query(`CREATE TABLE "client_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."client_interactions_type_enum" NOT NULL DEFAULT 'email', "description" text NOT NULL, "interaction_date" date NOT NULL, "logged_by_id" uuid NOT NULL, "interacted_with_id" uuid, "lead_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "loggedById" uuid, "interactedWithId" uuid, "interactedWithLeadId" uuid, CONSTRAINT "PK_3cafc23cc2144432e88d3708387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_notes" ADD CONSTRAINT "FK_cf54dc220bfa28b0b617c2c2819" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_notes" ADD CONSTRAINT "FK_4326d3a359321921d78fe82a142" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_notes" ADD CONSTRAINT "FK_4f38b60c4d0130ffb63e75ad225" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD CONSTRAINT "FK_76e195e48b220f444f7534f8a32" FOREIGN KEY ("loggedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD CONSTRAINT "FK_9a4db07d1067a8ece26cb1dd9c5" FOREIGN KEY ("interactedWithId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD CONSTRAINT "FK_8046641b2a7b6653681113d27ba" FOREIGN KEY ("interactedWithLeadId") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP CONSTRAINT "FK_8046641b2a7b6653681113d27ba"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP CONSTRAINT "FK_9a4db07d1067a8ece26cb1dd9c5"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP CONSTRAINT "FK_76e195e48b220f444f7534f8a32"`);
        await queryRunner.query(`ALTER TABLE "client_notes" DROP CONSTRAINT "FK_4f38b60c4d0130ffb63e75ad225"`);
        await queryRunner.query(`ALTER TABLE "client_notes" DROP CONSTRAINT "FK_4326d3a359321921d78fe82a142"`);
        await queryRunner.query(`ALTER TABLE "client_notes" DROP CONSTRAINT "FK_cf54dc220bfa28b0b617c2c2819"`);
        await queryRunner.query(`DROP TABLE "client_interactions"`);
        await queryRunner.query(`DROP TYPE "public"."client_interactions_type_enum"`);
        await queryRunner.query(`DROP TABLE "client_notes"`);
    }

}
