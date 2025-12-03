import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";

const server = new ApolloServer({
  schema,
});

const PORT = 4000;

startStandaloneServer(server, {
  listen: { port: PORT },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
