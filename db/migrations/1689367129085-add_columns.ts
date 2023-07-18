import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumns1689367129085 implements MigrationInterface {
    name = 'AddColumns1689367129085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "salePerItem"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "soldQTY" character varying DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "remainder" character varying`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "profit" character varying`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "status" character varying DEFAULT 'not_sold'`);
        await queryRunner.query(`COMMENT ON COLUMN "inventory"."salesPricePerMeasurement" IS 'This how much an item was sold  for'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "inventory"."salesPricePerMeasurement" IS 'This how much an item was bought for'`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "profit"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "remainder"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "soldQTY"`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "salePerItem" character varying`);
    }

}
