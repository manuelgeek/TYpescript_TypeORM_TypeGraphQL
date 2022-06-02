import {MigrationInterface, QueryRunner} from "typeorm";

export class AppMigrations1654183945123 implements MigrationInterface {
    name = 'AppMigrations1654183945123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "portfolio_version_entity" ("id" SERIAL NOT NULL, "version" "public"."portfolio_version_entity_version_enum" NOT NULL, "portfolioId" integer NOT NULL, CONSTRAINT "PK_e801f5a8cce6b1554a985905889" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "portfolio_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_3eeef6c2186d2bd1b4c22202ed2" UNIQUE ("url"), CONSTRAINT "PK_01c144e796498f5f4c56f7dfcbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "portfolioId" integer NOT NULL, "versionId" integer NOT NULL, CONSTRAINT "PK_59fbb5ed728bc66f697481a7d62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "portfolio_version_entity" ADD CONSTRAINT "FK_bb1c57b552c1a2b7584e54143d6" FOREIGN KEY ("portfolioId") REFERENCES "portfolio_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_entity" ADD CONSTRAINT "FK_fac29bd7bd7932fccd11d471fdf" FOREIGN KEY ("portfolioId") REFERENCES "portfolio_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_entity" ADD CONSTRAINT "FK_52de06a7d957301c115e4d97547" FOREIGN KEY ("versionId") REFERENCES "portfolio_version_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page_entity" DROP CONSTRAINT "FK_52de06a7d957301c115e4d97547"`);
        await queryRunner.query(`ALTER TABLE "page_entity" DROP CONSTRAINT "FK_fac29bd7bd7932fccd11d471fdf"`);
        await queryRunner.query(`ALTER TABLE "portfolio_version_entity" DROP CONSTRAINT "FK_bb1c57b552c1a2b7584e54143d6"`);
        await queryRunner.query(`DROP TABLE "page_entity"`);
        await queryRunner.query(`DROP TABLE "portfolio_entity"`);
        await queryRunner.query(`DROP TABLE "portfolio_version_entity"`);
    }

}
