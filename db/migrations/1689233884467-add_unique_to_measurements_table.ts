import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToMeasurementsTable1689233884467 implements MigrationInterface {
    name = 'AddUniqueToMeasurementsTable1689233884467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement" ADD CONSTRAINT "UQ_c12a927594123273abdccf6c8c5" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "measurement" DROP CONSTRAINT "UQ_c12a927594123273abdccf6c8c5"`);
    }

}
