require("dotenv").config({ path: "./.env" });
import express from "express";
import mongoose from "mongoose";
import { restaurantRouter, userRouter } from "./routes";

const { PORT, MONGO_URL } = process.env;
const app = express();

app.use(express.json());
app.use("/restaurant", restaurantRouter);
app.use("/user", userRouter);

if (!MONGO_URL || !PORT)
  throw Error("Please provide MONGO_URL and PORT to the env");

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch(console.log);
