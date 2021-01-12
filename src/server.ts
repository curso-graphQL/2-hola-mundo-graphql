import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { IResolvers, makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

const PORT = 5300;
const app = express();

const typeDefs = `
  type Query {
    hola: String!
    holaConNombre(nombre: String!): String!
    holaAlCursoGraphQL: String!
  }
`;

const resolvers: IResolvers = {
  Query: {
    hola(): string {
      return 'Hola Mundo';
    },
    holaConNombre( __: void, { nombre }): string {
      return `Hola Mundo, hola ${nombre}`;
    },
    holaAlCursoGraphQL(): string {
      return "Hola Mundo al curso GraphQL";
    }
  }
}

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

app.use(cors());
app.use(compression());
app.use('/', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(
  { port: PORT },
  () => console.log(`Hola Mundo API GraphQL http://localhost:${PORT}/graphql`)
)