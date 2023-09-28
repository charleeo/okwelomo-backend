import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKycTable1695832750233 implements MigrationInterface {
    name = 'CreateKycTable1695832750233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "kyc" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "bvn" character varying, "phone" character varying, "nin" character varying, "gender" "public"."kyc_gender_enum" DEFAULT 'male', "firstname" character varying(225) NOT NULL, "lastname" character varying(225), "address" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_eae0f69fb1b7097c4f0a25efd66" UNIQUE ("bvn"), CONSTRAINT "UQ_941b7a6c477a32a2b0aca2dac3d" UNIQUE ("nin"), CONSTRAINT "REL_ca948073ed4a3ba22030d37b3d" UNIQUE ("userId"), CONSTRAINT "PK_84ab2e81ea9700d29dda719f3be" PRIMARY KEY ("id")); COMMENT ON COLUMN "kyc"."bvn" IS 'the client''s bank verification number'; COMMENT ON COLUMN "kyc"."nin" IS 'User national identity number'; COMMENT ON COLUMN "kyc"."address" IS 'Business or house address'`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`DROP TABLE "kyc"`);
    }

}
