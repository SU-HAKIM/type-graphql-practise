import { ApolloError } from "apollo-server-express";
import { CreateUserInput, LoginInput, UserModel } from "../models/user";
import bcrypt from "bcrypt";
import { signJwt } from "../helpers/jwt";
import { Context } from "../types";

class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }
  async login(input: LoginInput, context: Context) {
    const e = "Invalid Email or Password";
    const user = UserModel.findOne({ email: input.email });
    if (!user) {
      throw new ApolloError(e);
    }
    const PasswordIsValid = await bcrypt.compare(input.password, user.password);
    if (!PasswordIsValid) {
      throw new ApolloError(e);
    }
    const token = signJwt(user);

    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return token;
  }
}

export default UserService;
