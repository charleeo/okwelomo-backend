import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoanRepaymentTable1700236034544 implements MigrationInterface {
    name = 'UpdateLoanRepaymentTable1700236034544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "next_repayment_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "next_repayment_date" date`);
    }

}
