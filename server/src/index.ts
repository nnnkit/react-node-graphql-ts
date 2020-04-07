import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";

async function startServer(app: Application) {
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });
  server.applyMiddleware({ app, path: "/graphql" });
  const port = 9000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Graphql endpoint is at http://localhost:${port}/graphql`);
  });
}
startServer(express());
