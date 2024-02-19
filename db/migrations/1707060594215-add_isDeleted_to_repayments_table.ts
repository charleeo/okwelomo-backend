import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsDeletedToRepaymentsTable1707060594215 implements MigrationInterface {
    name = 'AddIsDeletedToRepaymentsTable1707060594215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "isDeleted"`);
    }

}
