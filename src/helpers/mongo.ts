import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((err) => console.log(err));
