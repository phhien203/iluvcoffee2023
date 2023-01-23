# How to run migration

Create `typeorm-cli.config.ts` file with as follow

```typescript
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass123',
  database: 'postgres',
  entities: [],
  migrations: [],
});

```
## Creating a TypeOrm Migration

Imagine we want to change the `Coffee` entity's name to title.

```bash
npx typeorm migration:create src/migrations/CoffeeRefactor
```

Then refactor `cofffee.entity.ts` file
Add the following logic to `CoffeeRefactor` class

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoffeeRefactor1674001589870 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "name" to "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coffee" RENAME COLUMN "title" to "name"`,
    );
  }
}
```

Add `CoffeeRefactor` migration class to DataSource.migrations array in `typeorm-cli.config.ts` file, then build the app with `npm run build`.

Run the migration

```bash
npx typeorm migration:run -d dist/typeorm-cli.config
```
Revert the migration

```bash
npx typeorm migration:revert -d dist/typeorm-cli.config
```
