import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansTables1700207936557 implements MigrationInterface {
    name = 'UpdateLoansTables1700207936557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loans" ADD "expected_repayment_amount" numeric(10,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`COMMENT ON COLUMN "loans"."expected_repayment_amount" IS 'the loaned amount plus the loan interest'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "loans"."expected_repayment_amount" IS 'the loaned amount plus the loan interest'`);
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "expected_repayment_amount"`);
    }

}
