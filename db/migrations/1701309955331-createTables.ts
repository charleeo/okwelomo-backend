import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1701309955331 implements MigrationInterface {
    name = 'CreateTables1701309955331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "UQ_99797bb751811331b74d27865f3" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "UQ_ca948073ed4a3ba22030d37b3db" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "UQ_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "UQ_99797bb751811331b74d27865f3"`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
