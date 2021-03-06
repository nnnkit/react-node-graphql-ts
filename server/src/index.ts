require("dotenv").config();
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";

async function startServer(app: Application) {
  app.use(cookieParser(process.env.SECRET));
  const db = await connectDatabase();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({ app, path: "/api" });
  const port = 9000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`Graphql endpoint is at http://localhost:${port}/api`);
  });
}
startServer(express());
