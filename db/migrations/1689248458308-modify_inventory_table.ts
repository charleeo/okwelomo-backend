import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyInventoryTable1689248458308 implements MigrationInterface {
    name = 'ModifyInventoryTable1689248458308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" RENAME COLUMN "creatAT" TO "createdAT"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" RENAME COLUMN "createdAT" TO "creatAT"`);
    }

}
