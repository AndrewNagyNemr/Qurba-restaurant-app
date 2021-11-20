# Qurba-Restaurant-App

# Installation

Qurba-Restaurant-App requires only docker and docker-compose.
Rename the .env.example into .env 

```sh
git clone https://github.com/AndrewNagyNemr/Qurba-restaurant-app.git
cd Qurba-restaurant-app
docker-compose build && docker-composer up -d
```
#### This will start the following 
* The main app on port 3000
* The seach app on port 3001
* The mongodb server on port 27017
* The elastic search server on port 9200

#### Features
* Users can create a new restaurant that should include (but not limited to):
Restaurant Name, Restaurant Unique-Name, Cuisine, Location (Lat & Longitude)
* Users Schema should include (but not limited to): Full Name, Favourite Cuisines
* Users can list all restaurants in the platform, including filtering the list by cuisine.
* Users can get the details of a specific restaurant by Id or by restaurant unique-name (slug).
* Users can search all restaurants using any of the fields in that restaurant (name, cuisine) using fuzzy search.

#### Still under-development
* Users can find nearby restaurants within 1 KM based on location (latitude and longitude) of the restaurant.
* Users can retrieve a list of users for a specific Cuisine (e.g. Burgers) that have the following criteria:
**User has Burgers as part of their Favourite Cuisines
**User has a restaurant where the Cuisine is Burger
**This feature must be implemented using MongoDB Aggregation.