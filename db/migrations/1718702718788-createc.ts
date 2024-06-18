import { MigrationInterface, QueryRunner } from "typeorm";

export class Createc1718702718788 implements MigrationInterface {
    name = 'Createc1718702718788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot_password" ADD "is_expired" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot_password" DROP COLUMN "is_expired"`);
    }

}
