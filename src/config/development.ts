import ConfigInterface from './ConfigInterface';

const config: ConfigInterface = {
  env: 'development',
  database: {
    type: 'postgres',
    url: 'postgres://postgres:postgres@localhost/digication',
    entities: [`${__dirname}/../entities/**/*Entity.ts`],
    migrations: [`${__dirname}/../migrations/**/*.ts`],
  },
  graphQLPath: '/graphql',
  resolvers: [`${__dirname}/../resolvers/**/*Resolver.ts`],
};

export default config;
