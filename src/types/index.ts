import { Request, Response } from "express";
import { User } from "../models/user";

export interface Context {
  req: Request;
  res: Response;
  user: User | null;
}
