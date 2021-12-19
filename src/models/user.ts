import {
  getModelForClass,
  prop,
  Pre,
  ReturnModelType,
  queryMethod,
  index,
} from "@typegoose/typegoose";
import { IsEmail, MaxLength, min, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import { AsQueryMethod } from "@typegoose/typegoose/lib/types";

function findByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findByEmail>;
}
@Pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(this.password, salt);

  this.password = hashed;
})
@index({ email: 1 })
@queryMethod(findByEmail)
@ObjectType()
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  username: string;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  username: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "user password must be above 6 chars",
  })
  @MaxLength(20, {
    message: "user password must not exceed 20 chars",
  })
  @Field(() => String)
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
