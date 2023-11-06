import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1699229420476 implements MigrationInterface {
    name = 'CreateNewTables1699229420476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_setting" ADD "client_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-06T00:10:22.701Z"'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-06T00:10:22.703Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-05'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-05'`);
        await queryRunner.query(`ALTER TABLE "loan_setting" DROP COLUMN "client_id"`);
    }

}
