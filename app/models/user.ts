import mongoose from "mongoose";
import Joi from "joi";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  favoriteCuisines: string[];
}

export const User = mongoose.model<IUser>(
  "User",
  new mongoose.Schema<IUser>(
    {
      fullName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
      },
    },
    { strict: false }
  )
);

const schema = Joi.object<IUser, true>({
  fullName: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
  favoriteCuisines: Joi.array().items(Joi.number()).required(),
}).unknown(true);

export const validateUser = (inputs: IUser) => {
  return schema.validate(inputs, { abortEarly: false });
};
