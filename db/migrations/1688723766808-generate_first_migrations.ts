import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateFirstMigrations1688723766808 implements MigrationInterface {
    name = 'GenerateFirstMigrations1688723766808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`actions\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`actions\` varchar(225) NOT NULL, \`tag_line\` varchar(225) NOT NULL, UNIQUE INDEX \`IDX_a4b704522deb680f476b4d3a0e\` (\`actions\`), UNIQUE INDEX \`IDX_162d4e1f58b6d489b08889521b\` (\`tag_line\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`duties\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`name\` varchar(225) NOT NULL, UNIQUE INDEX \`IDX_7acf009b32746fae7b709d6d2a\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`warehouse_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`categoryName\` varchar(225) NOT NULL, \`categoryTag\` varchar(225) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_role\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`role_id\` int UNSIGNED NOT NULL, \`actions\` json NOT NULL, \`duty_id\` int UNSIGNED NOT NULL, \`status\` enum ('1', '0') NOT NULL COMMENT '1 means active status. O means inactive status' DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int UNSIGNED NULL, UNIQUE INDEX \`REL_d0e5815877f7395a198a4cb0a4\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`gender\` enum ('male', 'female', 'othere') NOT NULL DEFAULT 'male', \`firstname\` varchar(225) NOT NULL, \`lastname\` varchar(225) NULL, \`bio\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`warehouseId\` int UNSIGNED NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`warehouses\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`warehouseName\` varchar(225) NOT NULL, \`warehouseEmail\` varchar(225) NULL, \`warehousePhone\` varchar(225) NOT NULL, \`capacity\` varchar(225) NULL, \`status\` enum ('active', 'inactive') NOT NULL COMMENT '1 menas active status. 0 means inactive status' DEFAULT 'active', \`description\` text NULL, \`contactAddress\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`locationId\` int UNSIGNED NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`location\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`locationName\` varchar(225) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role_name\` varchar(225) NOT NULL, \`role\` varchar(225) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
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
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`location\``);
        await queryRunner.query(`DROP TABLE \`warehouses\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_d0e5815877f7395a198a4cb0a4\` ON \`user_role\``);
        await queryRunner.query(`DROP TABLE \`user_role\``);
        await queryRunner.query(`DROP TABLE \`warehouse_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_7acf009b32746fae7b709d6d2a\` ON \`duties\``);
        await queryRunner.query(`DROP TABLE \`duties\``);
        await queryRunner.query(`DROP INDEX \`IDX_162d4e1f58b6d489b08889521b\` ON \`actions\``);
        await queryRunner.query(`DROP INDEX \`IDX_a4b704522deb680f476b4d3a0e\` ON \`actions\``);
        await queryRunner.query(`DROP TABLE \`actions\``);
    }

}
