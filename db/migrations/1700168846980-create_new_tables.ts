import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1700168846980 implements MigrationInterface {
    name = 'CreateNewTables1700168846980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loan_types" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(225) NOT NULL, "description" character varying(225) NOT NULL, "status" character varying(225) NOT NULL, CONSTRAINT "UQ_f01bc0ab1212be820cfbe0f3604" UNIQUE ("type"), CONSTRAINT "PK_9f880f598e36617b7ba4ea096a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loan_repayment_duration_categoriess" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying(225) NOT NULL, "category_tagline" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2dc5286a85a24fbd60e0a1e8d37" UNIQUE ("category_name"), CONSTRAINT "UQ_a6cc779f35b9a82bd7f5dc1e845" UNIQUE ("category_tagline"), CONSTRAINT "PK_54b84b3bc54bb4c299b3e244871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET DEFAULT '2023-11-14'`);
        await queryRunner.query(`ALTER TABLE "loan_repayment" ALTER COLUMN "next_repayment_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET DEFAULT '2023-11-14'`);
        await queryRunner.query(`ALTER TABLE "loan" ALTER COLUMN "issue_date" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "loan_repayment_duration_categoriess"`);
        await queryRunner.query(`DROP TABLE "loan_types"`);
    }

}
