import express from "express";
import { IUser, User, validateUser } from "../models";
import { isValidMongooseObjectId } from "../utils";
import bcrypt from "bcrypt";
import { omit } from "lodash";

export const userRouter = express.Router();

userRouter.get("/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!isValidMongooseObjectId(_id))
    return res.status(400).json({ error: "invalid id" });

  const user = await User.findById(_id);

  if (!user) return res.status(404).json({ error: "not found" });

  return res.json(omit(user.toObject(), "password"));
});

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users.map((user) => omit(user.toObject(), "password")));
});

userRouter.post("/", async (req, res) => {
  const validation = validateUser(req.body);

  if (validation.error)
    return res.status(400).json(validation.error.details.map((e) => e.message));

  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json(["Email already exists"]);

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const newUser = await new User({ ...req.body, password }).save();

  res.status(201).json(omit(newUser.toObject(), "password"));
});

userRouter.patch("/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!isValidMongooseObjectId(_id))
    return res.status(400).json({ error: "invalid id" });

  const user = await User.findById(_id);
  if (!user) return res.status(404);

  user.set(req.body);
  const { error } = validateUser(user);
  if (error) return res.status(400).json(error.details.map((e) => e.message));

  await user.save();

  res.status(204).json({});
});

userRouter.delete("/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!isValidMongooseObjectId(_id))
    return res.status(400).json({ error: "invalid id" });

  await User.deleteOne({ _id });
  res.status(204).json({});
});
