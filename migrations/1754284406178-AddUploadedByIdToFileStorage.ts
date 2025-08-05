import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadedByIdToFileStorage1754284406178 implements MigrationInterface {
    name = 'AddUploadedByIdToFileStorage1754284406178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_storage" DROP CONSTRAINT "FK_68716369a00580eeff345f599bc"`);
        await queryRunner.query(`ALTER TABLE "file_storage" RENAME COLUMN "uploadedById" TO "uploaded_by_id"`);
        await queryRunner.query(`ALTER TABLE "file_storage" ADD CONSTRAINT "FK_f908d5e883cfc87b3cc931c992e" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_storage" DROP CONSTRAINT "FK_f908d5e883cfc87b3cc931c992e"`);
        await queryRunner.query(`ALTER TABLE "file_storage" RENAME COLUMN "uploaded_by_id" TO "uploadedById"`);
        await queryRunner.query(`ALTER TABLE "file_storage" ADD CONSTRAINT "FK_68716369a00580eeff345f599bc" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
