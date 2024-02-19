import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToRepaymentsTable1707071057664 implements MigrationInterface {
    name = 'AddIsDeletedToRepaymentsTable1707071057664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "deletedAt"`);
    }

}
