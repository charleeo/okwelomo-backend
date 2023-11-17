import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewTables1700178131831 implements MigrationInterface {
    name = 'CreateNewTables1700178131831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."loans_verification_status_enum" AS ENUM('approved', 'not_approved', 'pending', 'reviewed', 'declined')`);
        await queryRunner.query(`CREATE TYPE "public"."loans_interest_payment_status_enum" AS ENUM('paid', 'not_paid')`);
        await queryRunner.query(`CREATE TABLE "loans" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "loan_duration_category" integer NOT NULL, "loan_type" integer NOT NULL, "customer_id" integer NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "interest" numeric(10,2) NOT NULL DEFAULT '0', "repayment_sum" numeric(10,2) NOT NULL DEFAULT '0', "repayment_rate" character varying NOT NULL DEFAULT '0', "repayment_intervals" character varying NOT NULL DEFAULT '0', "repayment_due_date" date, "repayment_start_date" date, "issue_date" date, "reference" character varying NOT NULL, "verification_status" "public"."loans_verification_status_enum" NOT NULL DEFAULT 'pending', "interest_payment_status" "public"."loans_interest_payment_status_enum" NOT NULL DEFAULT 'paid', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "loans"`);
        await queryRunner.query(`DROP TYPE "public"."loans_interest_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."loans_verification_status_enum"`);
    }

}
