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
import { authChecker } from "./helpers/authChecker";

import "./helpers/mongo";
import { Context } from "./types";
import { verifyJwt } from "./helpers/jwt";
import { User } from "./models/user";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx;
      if (ctx.req.cookies.accessToken) {
        const user = verifyJwt<User>(ctx.req.cookies.accessToken);
        context.user = user;
      }
      return context;
    },
    plugins: [
      process.env.NODE_ENV === "product"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT, () => {
    console.log("app listening");
  });
}

bootstrap();
