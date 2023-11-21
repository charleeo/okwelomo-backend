import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoanRepaymentTable1700282785136 implements MigrationInterface {
    name = 'UpdateLoanRepaymentTable1700282785136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "repyment_reference" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "repyment_reference"`);
    }

}
