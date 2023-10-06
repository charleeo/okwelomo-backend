import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateKycTable1696249795583 implements MigrationInterface {
    name = 'CreateKycTable1696249795583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "actions" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "actions" character varying(225) NOT NULL, "tag_line" character varying(225) NOT NULL, CONSTRAINT "UQ_162d4e1f58b6d489b08889521b9" UNIQUE ("tag_line"), CONSTRAINT "PK_7bfb822f56be449c0b8adbf83cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "duties" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(225) NOT NULL, CONSTRAINT "UQ_7acf009b32746fae7b709d6d2ad" UNIQUE ("name"), CONSTRAINT "PK_f35c74c0ad8c80299ca5d511f95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "warehouse_categories" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryName" character varying(225) NOT NULL, "categoryTag" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_db5f2fd41d5c66bb5f3eadc2ab0" UNIQUE ("categoryTag"), CONSTRAINT "PK_0a6edf19ee66631fbe782eeda8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_status_enum" AS ENUM('1', '0')`);
        await queryRunner.query(`CREATE TABLE "user_roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" integer NOT NULL, "actions" json NOT NULL, "dutyId" integer NOT NULL, "status" "public"."user_roles_status_enum" NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_472b25323af01488f1f66a06b6" UNIQUE ("userId"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_roles"."status" IS '1 means active status. O means inactive status'`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_gender_enum" AS ENUM('male', 'female', 'othere')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_kyc_verification_status_enum" AS ENUM('verified', 'not_verified', 'pending', 'reviewed')`);
        await queryRunner.query(`CREATE TYPE "public"."kyc_kyc_level_enum" AS ENUM('1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "kyc" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "bvn" character varying, "phone" character varying, "nin" character varying, "gender" "public"."kyc_gender_enum" DEFAULT 'male', "firstname" character varying(225) NOT NULL, "lastname" character varying(225), "address" text NOT NULL, "kyc_verification_status" "public"."kyc_kyc_verification_status_enum" NOT NULL DEFAULT 'pending', "kyc_level" "public"."kyc_kyc_level_enum" NOT NULL DEFAULT '1', "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "UQ_eae0f69fb1b7097c4f0a25efd66" UNIQUE ("bvn"), CONSTRAINT "UQ_941b7a6c477a32a2b0aca2dac3d" UNIQUE ("nin"), CONSTRAINT "UQ_99797bb751811331b74d27865f3" UNIQUE ("user_id"), CONSTRAINT "REL_ca948073ed4a3ba22030d37b3d" UNIQUE ("userId"), CONSTRAINT "PK_84ab2e81ea9700d29dda719f3be" PRIMARY KEY ("id")); COMMENT ON COLUMN "kyc"."bvn" IS 'the client''s bank verification number'; COMMENT ON COLUMN "kyc"."nin" IS 'User national identity number'; COMMENT ON COLUMN "kyc"."address" IS 'Business or house address'; COMMENT ON COLUMN "kyc"."kyc_verification_status" IS 'verified is verified and no is not verified, review is when it is under review'; COMMENT ON COLUMN "kyc"."kyc_level" IS 'All newly created users will be on level one untill verified'`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_warehouses" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "warehouseId" integer, "userId" integer, CONSTRAINT "PK_4f06ee33982ed1b7d09e254292e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "measurement" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c12a927594123273abdccf6c8c5" UNIQUE ("name"), CONSTRAINT "PK_742ff3cc0dcbbd34533a9071dfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "itemName" character varying(225) NOT NULL, "description" text NOT NULL, "qty" numeric NOT NULL, "pricePerItem" numeric, "salesPerItem" numeric, "soldQTY" numeric DEFAULT '0', "remainder" numeric, "profit" numeric, "status" character varying DEFAULT 'not_sold', "createdAT" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "measurementId" integer, "warehouseId" integer, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id")); COMMENT ON COLUMN "inventory"."pricePerItem" IS 'This how much an item was bought for'; COMMENT ON COLUMN "inventory"."salesPerItem" IS 'This how much an item was sold  for'`);
        await queryRunner.query(`CREATE TYPE "public"."warehouses_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "warehouses" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "warehouseName" character varying(225) NOT NULL, "warehouseEmail" character varying(225), "warehousePhone" character varying(225) NOT NULL, "capacity" character varying(225), "status" "public"."warehouses_status_enum" NOT NULL DEFAULT 'active', "description" text, "contactAddress" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "locationId" integer, "categoryId" integer, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id")); COMMENT ON COLUMN "warehouses"."status" IS '1 menas active status. 0 means inactive status'`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "locationName" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_64deeae420dee5595cf7688a8ed" UNIQUE ("locationName"), CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" character varying(225) NOT NULL, "role" character varying(225) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "kyc" ADD CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_warehouses" ADD CONSTRAINT "FK_1b18601e807afc720012c48399c" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_warehouses" ADD CONSTRAINT "FK_e26c8df9150b68313b5f9e7f8ce" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_ab58315b1b03a056b0abdc64614" FOREIGN KEY ("measurementId") REFERENCES "measurement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_ece9de76054f8bfc637c0e5e6cc" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouses" ADD CONSTRAINT "FK_5a8277e0b8efda42895b7f8fad4" FOREIGN KEY ("categoryId") REFERENCES "warehouse_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_5a8277e0b8efda42895b7f8fad4"`);
        await queryRunner.query(`ALTER TABLE "warehouses" DROP CONSTRAINT "FK_ece9de76054f8bfc637c0e5e6cc"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_00e0948a0a75d2d5a19bc1106e8"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_ab58315b1b03a056b0abdc64614"`);
        await queryRunner.query(`ALTER TABLE "users_warehouses" DROP CONSTRAINT "FK_e26c8df9150b68313b5f9e7f8ce"`);
        await queryRunner.query(`ALTER TABLE "users_warehouses" DROP CONSTRAINT "FK_1b18601e807afc720012c48399c"`);
        await queryRunner.query(`ALTER TABLE "kyc" DROP CONSTRAINT "FK_ca948073ed4a3ba22030d37b3db"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "warehouses"`);
        await queryRunner.query(`DROP TYPE "public"."warehouses_status_enum"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "measurement"`);
        await queryRunner.query(`DROP TABLE "users_warehouses"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "kyc"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_kyc_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_kyc_verification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."kyc_gender_enum"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_status_enum"`);
        await queryRunner.query(`DROP TABLE "warehouse_categories"`);
        await queryRunner.query(`DROP TABLE "duties"`);
        await queryRunner.query(`DROP TABLE "actions"`);
    }

}
