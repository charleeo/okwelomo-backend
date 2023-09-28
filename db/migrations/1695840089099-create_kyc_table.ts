import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKycTable1695840089099 implements MigrationInterface {
    name = 'CreateKycTable1695840089099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "UQ_99797bb751811331b74d27865f3" UNIQUE ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "UQ_99797bb751811331b74d27865f3"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "user_id"`);
    }

}
