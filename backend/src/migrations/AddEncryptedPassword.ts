import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddEncryptedPassword implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "users",
            new TableColumn({
                name: "encryptedPassword",
                type: "varchar",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "encryptedPassword");
    }
} 