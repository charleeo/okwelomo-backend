import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansTable1699992464398 implements MigrationInterface {
    name = 'UpdateLoansTable1699992464398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ADD "repayment_intervals" character varying NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."loan_interest_payment_status_enum" AS ENUM('paid', 'not_paid')`);
        await queryRunner.query(`ALTER TABLE "loan" ADD "interest_payment_status" "public"."loan_interest_payment_status_enum" NOT NULL DEFAULT 'paid'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-14T20:07:46.257Z"'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-14T20:07:46.259Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-14'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-14'`);
        await queryRunner.query(`ALTER TABLE "loan" DROP COLUMN "interest_payment_status"`);
        await queryRunner.query(`DROP TYPE "public"."loan_interest_payment_status_enum"`);
        await queryRunner.query(`ALTER TABLE "loan" DROP COLUMN "repayment_intervals"`);
    }

}
