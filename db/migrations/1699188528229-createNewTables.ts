import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1699188528229 implements MigrationInterface {
    name = 'CreateNewTables1699188528229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loan_setting" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "application_password" character varying, "receiving_account" character varying, "receiving_bank" character varying, "default_loan_type" integer, CONSTRAINT "PK_ac5cd93fa34abb2e2831719191c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-05T12:48:49.703Z"'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-05T12:48:49.705Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-05'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-05'`);
        await queryRunner.query(`DROP TABLE "loan_setting"`);
    }

}
