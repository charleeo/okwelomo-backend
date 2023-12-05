import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKycTable1701716968716 implements MigrationInterface {
  name = 'UpdateKycTable1701716968716';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "kyc" ADD "remark" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "kyc" DROP COLUMN "remark"`);
  }
}
