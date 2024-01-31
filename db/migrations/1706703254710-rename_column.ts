import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumn1706703254710 implements MigrationInterface {
    name = 'RenameColumn1706703254710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP CONSTRAINT "FK_c849a6e16d41929296cdef96c7a"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" RENAME COLUMN "reference" TO "loan_id"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP CONSTRAINT "FK_1a9c1d5b6f896d7e4e5354a6a21"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" RENAME COLUMN "loan_id" TO "reference"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD CONSTRAINT "FK_c849a6e16d41929296cdef96c7a" FOREIGN KEY ("reference") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
