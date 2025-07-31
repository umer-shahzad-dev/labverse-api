import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentsTable1753954914211 implements MigrationInterface {
    name = 'CreatePaymentsTable1753954914211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('Bank Transfer', 'Credit Card', 'Debit Card', 'Cash', 'Online Gateway', 'Cheque', 'Other')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('Successful', 'Pending', 'Failed', 'Refunded', 'Cancelled')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(12,2) NOT NULL, "payment_date" date NOT NULL, "payment_method" "public"."payments_payment_method_enum" NOT NULL DEFAULT 'Bank Transfer', "transaction_id" text, "notes" text, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'Successful', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invoice_id" uuid NOT NULL, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "paid_amount" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_563a5e248518c623eebd987d43e" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_563a5e248518c623eebd987d43e"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "paid_amount"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
    }

}
