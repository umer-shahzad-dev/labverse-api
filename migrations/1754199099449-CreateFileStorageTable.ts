import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileStorageTable1754199099449 implements MigrationInterface {
    name = 'CreateFileStorageTable1754199099449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP CONSTRAINT "FK_8046641b2a7b6653681113d27ba"`);
        await queryRunner.query(`CREATE TABLE "file_storage" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "file_size" bigint NOT NULL, "s3_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "uploadedById" uuid, CONSTRAINT "PK_2834b5398654dd125afabfd0dc2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP COLUMN "interactedWithLeadId"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD CONSTRAINT "FK_697f63d5b9c73588c08699cc454" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_storage" ADD CONSTRAINT "FK_68716369a00580eeff345f599bc" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_storage" DROP CONSTRAINT "FK_68716369a00580eeff345f599bc"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" DROP CONSTRAINT "FK_697f63d5b9c73588c08699cc454"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD "interactedWithLeadId" uuid`);
        await queryRunner.query(`DROP TABLE "file_storage"`);
        await queryRunner.query(`ALTER TABLE "client_interactions" ADD CONSTRAINT "FK_8046641b2a7b6653681113d27ba" FOREIGN KEY ("interactedWithLeadId") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
