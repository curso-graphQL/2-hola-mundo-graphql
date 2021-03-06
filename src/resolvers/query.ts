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