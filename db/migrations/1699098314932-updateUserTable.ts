import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1699098314932 implements MigrationInterface {
    name = 'UpdateUserTable1699098314932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
    }

}
