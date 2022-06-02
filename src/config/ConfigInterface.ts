import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { BuildSchemaOptions } from 'type-graphql';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default interface ConfigInterface {
  readonly env: 'development' | 'test' | 'staging' | 'production';
  readonly database: PostgresConnectionOptions | SqliteConnectionOptions;
  readonly graphQLPath: string;
  readonly resolvers: BuildSchemaOptions['resolvers'];
}
