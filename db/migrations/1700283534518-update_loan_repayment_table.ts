import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoanRepaymentTable1700283534518 implements MigrationInterface {
    name = 'UpdateLoanRepaymentTable1700283534518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "repayment_reference" character varying`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "confirmation_status" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "confirmation_status"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "repayment_reference"`);
    }

}
