import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1702325059428 implements MigrationInterface {
    name = 'UpdateUser1702325059428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "uername" TO "username"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_f4c69a9fb66be42e3bf8c1987a3" TO "UQ_fe0bb3f6520ee0469504521e710"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" TO "UQ_f4c69a9fb66be42e3bf8c1987a3"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "username" TO "uername"`);
    }

}
