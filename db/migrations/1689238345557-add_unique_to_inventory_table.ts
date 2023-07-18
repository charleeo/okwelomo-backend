import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToInventoryTable1689238345557 implements MigrationInterface {
    name = 'AddUniqueToInventoryTable1689238345557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "warehouseId" integer`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "warehouseId"`);
    }

}
