import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeadsTable1754107562241 implements MigrationInterface {
    name = 'CreateLeadsTable1754107562241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_post_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "author_id" uuid NOT NULL, "blog_post_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "blogPostId" uuid, CONSTRAINT "PK_5d2b874a2d28cb147bea267494b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "author_id" uuid NOT NULL, "category_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "authorId" uuid, "categoryId" uuid, CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE ("slug"), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."leads_status_enum" AS ENUM('new', 'contacted', 'qualified', 'lost')`);
        await queryRunner.query(`CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20), "company" character varying(255), "source" character varying(50), "status" "public"."leads_status_enum" NOT NULL DEFAULT 'new', "assigned_to_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "assignedToId" uuid, CONSTRAINT "UQ_b3eea7add0e16594dba102716c5" UNIQUE ("email"), CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_post_comments" ADD CONSTRAINT "FK_410815fe554ca1bc416cf61e992" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_post_comments" ADD CONSTRAINT "FK_dfa4291d1a7f2dde6b77cc0fbf1" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_09269227c7acf3cdf47ea4051e1" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_aaf6cdeebd8497289338899961b" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_533da3a3887638192a5dfa2c176" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_533da3a3887638192a5dfa2c176"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_aaf6cdeebd8497289338899961b"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_09269227c7acf3cdf47ea4051e1"`);
        await queryRunner.query(`ALTER TABLE "blog_post_comments" DROP CONSTRAINT "FK_dfa4291d1a7f2dde6b77cc0fbf1"`);
        await queryRunner.query(`ALTER TABLE "blog_post_comments" DROP CONSTRAINT "FK_410815fe554ca1bc416cf61e992"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TYPE "public"."leads_status_enum"`);
        await queryRunner.query(`DROP TABLE "blog_posts"`);
        await queryRunner.query(`DROP TABLE "blog_post_comments"`);
    }

}
