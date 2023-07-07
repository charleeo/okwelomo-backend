import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateTest1688723932135 implements MigrationInterface {
    name = 'GenerateTest1688723932135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_66dcc8b80d6571a4edf537bff1e\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(225) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`bio\` \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`warehouseId\` \`warehouseId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_ece9de76054f8bfc637c0e5e6cc\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_5a8277e0b8efda42895b7f8fad4\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`warehouseEmail\` \`warehouseEmail\` varchar(225) NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`capacity\` \`capacity\` varchar(225) NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`description\` \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`contactAddress\` \`contactAddress\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`locationId\` \`locationId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`categoryId\` \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`role\` \`role\` varchar(225) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_66dcc8b80d6571a4edf537bff1e\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_ece9de76054f8bfc637c0e5e6cc\` FOREIGN KEY (\`locationId\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_5a8277e0b8efda42895b7f8fad4\` FOREIGN KEY (\`categoryId\`) REFERENCES \`warehouse_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_5a8277e0b8efda42895b7f8fad4\``);
        await queryRunner.query(`ALTER TABLE \`warehouses\` DROP FOREIGN KEY \`FK_ece9de76054f8bfc637c0e5e6cc\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_66dcc8b80d6571a4edf537bff1e\``);
        await queryRunner.query(`ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_d0e5815877f7395a198a4cb0a46\``);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`role\` \`role\` varchar(225) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`locationId\` \`locationId\` int UNSIGNED NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`contactAddress\` \`contactAddress\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`capacity\` \`capacity\` varchar(225) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` CHANGE \`warehouseEmail\` \`warehouseEmail\` varchar(225) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_5a8277e0b8efda42895b7f8fad4\` FOREIGN KEY (\`categoryId\`) REFERENCES \`warehouse_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`warehouses\` ADD CONSTRAINT \`FK_ece9de76054f8bfc637c0e5e6cc\` FOREIGN KEY (\`locationId\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`warehouseId\` \`warehouseId\` int UNSIGNED NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`bio\` \`bio\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`lastname\` \`lastname\` varchar(225) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_66dcc8b80d6571a4edf537bff1e\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_role\` CHANGE \`user_id\` \`user_id\` int UNSIGNED NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user_role\` ADD CONSTRAINT \`FK_d0e5815877f7395a198a4cb0a46\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
