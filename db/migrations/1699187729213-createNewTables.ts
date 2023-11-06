import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1699187729213 implements MigrationInterface {
    name = 'CreateNewTables1699187729213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loan_category" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "category_name" character varying(225) NOT NULL, "category_tagline" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a335ad80100976aeaab389032f4" UNIQUE ("category_name"), CONSTRAINT "UQ_ce17f5d429a4ed7c2ed6c6c995d" UNIQUE ("category_tagline"), CONSTRAINT "PK_3a0f187a05fa939549b4da1574a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loan" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" integer NOT NULL, "customer_id" integer NOT NULL, "amount" numeric NOT NULL DEFAULT '0', "interest" numeric NOT NULL DEFAULT '0', "repayment_sum" numeric NOT NULL DEFAULT '0', "repayment_rate" character varying NOT NULL DEFAULT '0', "repayment_due_date" date, "repayment_start_date" date, "issue_date" date NOT NULL DEFAULT '"2023-11-05T12:35:31.723Z"', "reference" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ceda725a323d254a5fd48bf95f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "loan_repayment" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL DEFAULT '0', "reference" character varying NOT NULL, "repayments_data" jsonb NOT NULL DEFAULT '{}', "next_repayment_date" date NOT NULL DEFAULT '"2023-11-05T12:35:31.726Z"', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a628a0f3e911ce163c602fcace" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "loan_repayment"`);
        await queryRunner.query(`DROP TABLE "loan"`);
        await queryRunner.query(`DROP TABLE "loan_category"`);
    }

}
