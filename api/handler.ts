import { ApolloServer } from 'apollo-server-lambda';
import { importSchema } from 'graphql-import';
import { resolvers } from './resolver';

// The GraphQL schema
const typeDefs = importSchema('schema.gql');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: 'http://localhost:3000/dev/graphql'
  }
});

export const graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
  },
});