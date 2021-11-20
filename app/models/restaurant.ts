import mongoose from "mongoose";
import Joi from "joi";

export interface IRestaurant {
  name: string;
  uniqueName: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  cuisine: string;
}

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

export const Restaurant = mongoose.model<IRestaurant>(
  "restaurant",
  new mongoose.Schema<IRestaurant>(
    {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      cuisine: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      uniqueName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
      },
      location: {
        type: pointSchema,
        required: true,
        index:"2d"
      },
    },
    { strict: false }
  )
);

const schema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  uniqueName: Joi.string().min(5).max(50).required(),
  location: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).min(2).max(2).required(),
  }).required(),
  cuisine: Joi.string().min(5).max(50).required(),
}).unknown(true);

export const validateRestaurant = (inputs: IRestaurant) => {
  return schema.validate(inputs, { abortEarly: false });
};
