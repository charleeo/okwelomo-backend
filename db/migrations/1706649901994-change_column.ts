import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumn1706649901994 implements MigrationInterface {
    name = 'ChangeColumn1706649901994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "comment" text`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "reference" integer`);
        await queryRunner.query(`ALTER TABLE "loans" ADD "comment" text`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "confirmation_status"`);
        await queryRunner.query(`CREATE TYPE "public"."loan_repayment_confirmation_status_enum" AS ENUM('confirmed', 'pending', 'disputed', 'declined')`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "confirmation_status" "public"."loan_repayment_confirmation_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD CONSTRAINT "FK_c849a6e16d41929296cdef96c7a" FOREIGN KEY ("reference") REFERENCES "loans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP CONSTRAINT "FK_c849a6e16d41929296cdef96c7a"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "confirmation_status"`);
        await queryRunner.query(`DROP TYPE "public"."loan_repayment_confirmation_status_enum"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ADD "confirmation_status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "loans" DROP COLUMN "comment"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "reference"`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" DROP COLUMN "comment"`);
    }

}
