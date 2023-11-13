import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLoansTable1699910491192 implements MigrationInterface {
    name = 'UpdateLoansTable1699910491192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-13T21:21:33.044Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."loan_verification_status_enum" RENAME TO "loan_verification_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."loan_verification_status_enum" AS ENUM('pending', 'approved', 'declined', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" TYPE "public"."loan_verification_status_enum" USING "verification_status"::"text"::"public"."loan_verification_status_enum"`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" SET DEFAULT 'declined'`);
        await queryRunner.query(`DROP TYPE "public"."loan_verification_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-13T21:21:33.046Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-13'`);
        await queryRunner.query(`CREATE TYPE "public"."loan_verification_status_enum_old" AS ENUM('verified', 'not_verified', 'pending', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" TYPE "public"."loan_verification_status_enum_old" USING "verification_status"::"text"::"public"."loan_verification_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "verification_status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."loan_verification_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."loan_verification_status_enum_old" RENAME TO "loan_verification_status_enum"`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-13'`);
    }

}
