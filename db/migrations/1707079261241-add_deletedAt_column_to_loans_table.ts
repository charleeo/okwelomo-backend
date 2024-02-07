import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumnToLoansTable1707079261241 implements MigrationInterface {
    name = 'AddDeletedAtColumnToLoansTable1707079261241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "deletedAt"`);
    }

}
