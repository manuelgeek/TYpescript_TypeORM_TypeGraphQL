import { GraphQLSchema } from 'graphql';
import { BuildSchemaOptions, buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';

export function createSchema(options?: Omit<BuildSchemaOptions, 'resolvers'>): GraphQLSchema {
  return buildSchemaSync({
    resolvers: [`${__dirname}/../resolvers/**/*Resolver.ts`],
    emitSchemaFile: true,
    container: Container,
    validate: true,
    ...options,
  });
}
