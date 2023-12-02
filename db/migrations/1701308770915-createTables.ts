import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1701308770915 implements MigrationInterface {
    name = 'CreateTables1701308770915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "UQ_99797bb751811331b74d27865f3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "UQ_99797bb751811331b74d27865f3" UNIQUE ("user_id")`);
    }

}
