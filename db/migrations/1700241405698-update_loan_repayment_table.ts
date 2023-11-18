import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoanRepaymentTable1700241405698 implements MigrationInterface {
    name = 'UpdateLoanRepaymentTable1700241405698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" ADD "repayment_percentage" character varying NOT NULL DEFAULT '0%'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "repayment_percentage"`);
    }

}
