import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyKycTable1696058476647 implements MigrationInterface {
    name = 'ModifyKycTable1696058476647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" ADD "kyc_verification_status" text NOT NULL DEFAULT 'no'`);
        await queryRunner.query(`COMMENT ON COLUMN "kyc"."kyc_verification_status" IS 'yes is verified and no is not verified, review is when it is under review'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "kyc"."kyc_verification_status" IS 'yes is verified and no is not verified, review is when it is under review'`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "kyc_verification_status"`);
    }

}
