import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from "./resolvers";

import "./helpers/mongo";
import { Context } from "./types";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    //authChecker
  });
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => ctx,
    plugins: [
      process.env.NODE_ENV === "product"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log("app listening");
  });
}

bootstrap();
