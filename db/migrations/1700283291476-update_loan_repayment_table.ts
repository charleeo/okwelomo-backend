import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoanRepaymentTable1700283291476 implements MigrationInterface {
    name = 'UpdateLoanRepaymentTable1700283291476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "repayment_reference" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "repayment_reference"`);
    }

}
