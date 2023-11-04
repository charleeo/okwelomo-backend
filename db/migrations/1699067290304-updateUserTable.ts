import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1699067290304 implements MigrationInterface {
    name = 'UpdateUserTable1699067290304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "firstname" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastname" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstname"`);
    }

}
