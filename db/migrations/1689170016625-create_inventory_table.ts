import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInventoryTable1689170016625 implements MigrationInterface {
    name = 'CreateInventoryTable1689170016625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "itemName" character varying(225) NOT NULL, "description" text NOT NULL, "qty" character varying NOT NULL, "pricePerItem" character varying, "salePerItem" character varying, "salesPricePerMeasurement" character varying, "creatAT" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "measurementId" integer, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id")); COMMENT ON COLUMN "inventory"."pricePerItem" IS 'This how much an item was bought for'; COMMENT ON COLUMN "inventory"."salePerItem" IS 'This how much an item will be sold for'; COMMENT ON COLUMN "inventory"."salesPricePerMeasurement" IS 'This how much an item was bought for'`);
        await queryRunner.query(`CREATE TABLE "measurement" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_ab58315b1b03a056b0abdc64614" FOREIGN KEY ("measurementId") REFERENCES "measurement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_ab58315b1b03a056b0abdc64614"`);
        await queryRunner.query(`DROP TABLE "measurement"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
    }

}
