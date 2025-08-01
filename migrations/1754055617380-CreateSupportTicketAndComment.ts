import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSupportTicketAndComment1754055617380 implements MigrationInterface {
    name = 'CreateSupportTicketAndComment1754055617380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ticket_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "ticket_id" uuid NOT NULL, "author_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ticketId" uuid, "authorId" uuid, CONSTRAINT "PK_811ed3b81dd8df6b9a92058d89c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."support_tickets_status_enum" AS ENUM('Open', 'In Progress', 'Resolved', 'Closed')`);
        await queryRunner.query(`CREATE TYPE "public"."support_tickets_priority_enum" AS ENUM('Low', 'Medium', 'High', 'Critical')`);
        await queryRunner.query(`CREATE TABLE "support_tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "status" "public"."support_tickets_status_enum" NOT NULL DEFAULT 'Open', "priority" "public"."support_tickets_priority_enum" NOT NULL DEFAULT 'Medium', "reporter_id" uuid NOT NULL, "assigned_to_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "reporterId" uuid, "assignedToId" uuid, CONSTRAINT "PK_942e8d8f5df86100471d2324643" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" ADD CONSTRAINT "FK_f6beba8ae36e1ce20968d7a3192" FOREIGN KEY ("ticketId") REFERENCES "support_tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" ADD CONSTRAINT "FK_4497112178bae33622ee27543e4" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_0a8bb7a042873f31a39eaaa0ca9" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support_tickets" ADD CONSTRAINT "FK_947e77544ab7d5fd9521c44e069" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_947e77544ab7d5fd9521c44e069"`);
        await queryRunner.query(`ALTER TABLE "support_tickets" DROP CONSTRAINT "FK_0a8bb7a042873f31a39eaaa0ca9"`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" DROP CONSTRAINT "FK_4497112178bae33622ee27543e4"`);
        await queryRunner.query(`ALTER TABLE "ticket_comments" DROP CONSTRAINT "FK_f6beba8ae36e1ce20968d7a3192"`);
        await queryRunner.query(`DROP TABLE "support_tickets"`);
        await queryRunner.query(`DROP TYPE "public"."support_tickets_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."support_tickets_status_enum"`);
        await queryRunner.query(`DROP TABLE "ticket_comments"`);
    }

}
