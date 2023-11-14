import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansTable1699974117125 implements MigrationInterface {
    name = 'UpdateLoansTable1699974117125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-14T15:01:58.533Z"'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-14T15:01:58.535Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-13'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-13'`);
    }

}
