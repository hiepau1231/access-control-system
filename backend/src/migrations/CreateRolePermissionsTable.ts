import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRolePermissionsTable implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "role_permissions",
            columns: [
                {
                    name: "roleId",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "permissionId",
                    type: "varchar",
                    isPrimary: true
                }
            ]
        }));

        await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
            columnNames: ["roleId"],
            referencedColumnNames: ["id"],
            referencedTableName: "roles",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("role_permissions", new TableForeignKey({
            columnNames: ["permissionId"],
            referencedColumnNames: ["id"],
            referencedTableName: "permissions",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("role_permissions");
        if (table) {
            const foreignKeys = table.foreignKeys;
            await Promise.all(foreignKeys.map(foreignKey => queryRunner.dropForeignKey("role_permissions", foreignKey)));
        }
        await queryRunner.dropTable("role_permissions");
    }
}