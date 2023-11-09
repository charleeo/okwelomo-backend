import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansTbale1699536716724 implements MigrationInterface {
    name = 'UpdateLoansTbale1699536716724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loan_verification_status_enum" AS ENUM('verified', 'not_verified', 'pending', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "loan" ADD "verification_status" "public"."loan_verification_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-09T13:31:58.576Z"'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-09T13:31:58.578Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-06'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-06'`);
        await queryRunner.query(`ALTER TABLE "loan" DROP COLUMN "verification_status"`);
        await queryRunner.query(`DROP TYPE "public"."loan_verification_status_enum"`);
    }

}
