import { Context } from "../types";
import { AuthChecker } from "type-graphql";

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return !!context.user;
};
