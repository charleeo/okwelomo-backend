import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1702301793039 implements MigrationInterface {
    name = 'UpdateUser1702301793039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "id_cards" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, CONSTRAINT "UQ_4526637b211a4159bc8bad5edf3" UNIQUE ("name"), CONSTRAINT "PK_f2773eeab4a00cdba99cc155396" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD "id_card_type" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_picture" SET DEFAULT 'images/no_image.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "profile_picture" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "id_card_type"`);
        await queryRunner.query(`DROP TABLE "id_cards"`);
    }

}
