import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserTable1699640401185 implements MigrationInterface {
    name = 'ModifyUserTable1699640401185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "interest" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "repayment_sum" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '"2023-11-10T18:20:03.048Z"'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '"2023-11-10T18:20:03.051Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-09'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-09'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "repayment_sum" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "interest" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "amount" TYPE numeric`);
    }

}
