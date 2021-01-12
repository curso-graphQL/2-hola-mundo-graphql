# Hola Mundo en GraphQL

## 1. Crear/configurar archivos necesarios

1. Generamos el archivo *package.json* inciando el proyecto con el comando ```npm init```.
2. Generamos el archivo *tsconfig.json* para configurar typeScript mediante el comando ```npx tsc --init --rootDir src --outDir build --lib dom,es6 module commonjs --removeComments --target es6```

## 2. Instalación de dependencias

En este proyecto necesitarremos las siguientes dependencias:
- express
- express-graphql
- graphql
- graphql-import-node
- compression
- cors
- typescript
- graphql-tools
- graphql-playground-middleware-express
- nodemon
- ts-node

### Dependencias de producción:
```npm install express express-graphql graphql ncp http graphql-import-node compression cors typescript graphql-tools graphql-playground-middleware-express nodemon ts-node```

### Dependencias de desarrollo:
```npm install @types/compression @types/express @types/cors @types/express-graphql @types/node @types/graphql -D```

## 3. Configuración de scripts package.json

En el archivo *package.json* incluimos la siguiente propiedad:
~~~
  "scripts": {
    "start": "node build/server.js",
    "build": "tsc -p . && ncp src/schema build/schema",
    "start:dev": "npm run build:dev",
    "build:dev": "nodemon 'src/server.ts' --exec 'ts-node' src/server.ts -e ts.graphql"
  },
  ~~~

Creamos en la raiz la carpeta src y dentro de ella el archivo server.js (punto de entrada de la aplicación).

Para comprobar que funciona correctamente en *server.js* ponemos un console log que podrá verse en la terminal cuando ejecutemos ```npm start:dev```

## 4. Inicializar el servidor express con los ajustes por defecto.

~~~
import express from 'express';
import compression from 'compression';
import cors from 'cors';

const PORT = 5300;
const app = express();

app.use(cors());
app.use(compression());
app.use('/', (re, res) => {
  res.send('Bienvenido al curso de GraphQL')
});

app.listen(
  { port: PORT },
  () => console.log(`Hola Mundo API GraphQL http://localhost:${PORT}`)
)
~~~

## 5. Pasar de Node Express a GraphQL

Debemos seguir los siguientes pasos inicialmente en el archivo *server.ts* que luego refactorizaremos a nuevos archivos.

1. Definimos los **types**:
~~~
const typeDefs = `
  type Query {
    hola: String!
    holaConNombre(nombre: String!): String!
    holaAlCursoGraphQL: String!
  }
`;
~~~

2. Definimos los **resolvers**:
~~~
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
~~~

3. Relacionamos los **types** con los **resolvers**

~~~
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});
~~~

4. Modificamos la ruta para utilizar GraphQL. Debemos importar graphQlHTTP para poder utilizarlo.

```import { graphqlHTTP } from 'express-graphql';```
~~~
app.use('/', graphqlHTTP({
  schema,
  graphiql: true
}));
~~~

5. Refactorización

En src creamos dos nuevos directorios para los resolvers y para el schema.

En el directorio resolvers creamos dos archivos:

~~~
\\query.ts
import { IResolvers } from 'graphql-tools';

const query: IResolvers = {
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

export default query;
~~~

~~~
\\resolversMap.ts
import { IResolvers } from 'graphql-tools';
import query from './query';

const resolvers: IResolvers = {
  ...query
}

export default resolvers;
~~~

En el directorio schema creamos dos archivos:

~~~
\\ schema.graphql
type Query {
  hola: String!
  holaConNombre(nombre: String!): String!
  holaAlCursoGraphQL: String!
}
~~~

~~~
\\ index.ts
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import 'graphql-import-node';
import typeDefs from './schema.graphql';
import resolvers from '../resolvers/resolversMap';

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
~~~