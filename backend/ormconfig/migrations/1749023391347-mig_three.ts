import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigThree1749023391347 implements MigrationInterface {
  name = 'MigThree1749023391347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_reset_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_reset_token_expires_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "password_reset_token_expires_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "password_reset_token"`,
    );
  }
}
