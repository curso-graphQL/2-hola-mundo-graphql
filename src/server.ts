import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema'
const PORT = 5300;
const app = express();

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