import express from "express";
import { IRestaurant, Restaurant, User, validateRestaurant } from "../models";
import { isValidMongooseObjectId } from "../utils";
import axios from "axios";

const { SEARCH_URL } = process.env;
if (!SEARCH_URL) throw Error("Please provide SEARCH_URL to the env");

const searchApi = axios.create({
  baseURL: SEARCH_URL,
});
const index = "restaurant";
const type = "app";

export const restaurantRouter = express.Router();

restaurantRouter.get("/nearby", async (req, res) => {
  const { long, lat } = req.query;
  if (!long || !lat)
    return res.status(400).json({ error: "long and lat are required" });
  const restaurants = await User.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [+long, +lat],
        },
        $maxDistance: 1,
      },
    },
  });

  console.log(restaurants);

  if (!restaurants.length)
    return res.status(404).json({ error: "no restaurant are near to you" });

  res.json(restaurants);
});

//To get restaurant by _id or by unique name
restaurantRouter.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  let restaurant;
  if (isValidMongooseObjectId(identifier))
    restaurant = await Restaurant.findById(identifier);
  else restaurant = await Restaurant.findOne({ uniqueName: identifier });

  if (!restaurant) return res.status(404).json({ error: "not found" });

  return res.json(restaurant);
});

//To get all restaurants or filter them by cuisine
restaurantRouter.get("/", async (req, res) => {
  const { cuisine } = req.query;
  const search = cuisine ? { cuisine } : null;
  const { data: restaurants } = await searchApi.post("/search", {
    index,
    search,
  });
  res.json(restaurants);
});

restaurantRouter.post("/", async (req, res) => {
  const validation = validateRestaurant(req.body);

  //validating all restaurant attributes
  if (validation.error)
    return res.status(400).json(validation.error.details.map((e) => e.message));

  //validating restaurant uniqueName
  const restaurantLockup = await Restaurant.findOne({
    uniqueName: req.body.uniqueName,
  });
  if (restaurantLockup)
    return res.status(400).json(["restaurant unique name already exists"]);

  const restaurant = new Restaurant(req.body);
  const newRestaurant = await restaurant.save();
  res.json(newRestaurant);

  await searchApi.post("/index", {
    body: { id: newRestaurant._id, ...req.body },
    index,
    type,
  });
});

restaurantRouter.patch("/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!isValidMongooseObjectId(_id))
    res.status(400).json({ error: "invalid id" });

  const restaurant = await Restaurant.findById(_id);
  if (!restaurant) return res.status(404);

  restaurant.set(req.body);
  const { error } = validateRestaurant(restaurant);
  if (error) return res.status(400).json(error.details.map((e) => e.message));

  await restaurant.save();
  res.status(204).json({});
});

restaurantRouter.delete("/:_id", async (req, res) => {
  const { _id } = req.params;

  if (!isValidMongooseObjectId(_id))
    res.status(400).json({ error: "invalid id" });

  await Restaurant.deleteOne({ _id });
  res.status(204).json({});

  await searchApi.post("/delete", {
    index,
    type,
    id: _id,
  });
});
