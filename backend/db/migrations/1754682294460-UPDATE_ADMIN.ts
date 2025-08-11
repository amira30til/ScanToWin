import { MigrationInterface, QueryRunner } from "typeorm";

export class UPDATEADMIN1754682294460 implements MigrationInterface {
    name = 'UPDATEADMIN1754682294460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" RENAME COLUMN "name" TO "firstName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" RENAME COLUMN "firstName" TO "name"`);
    }

}
