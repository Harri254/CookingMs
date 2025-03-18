import { Router } from "express";
import gettingAllMeals from "../controllers/meals/getMeals.controller.js";
import addingMeal from "../controllers/meals/addMeal.controller.js";

const route = Router();

route.get("/", gettingAllMeals);      // GET /api/meals
route.post("/new", addingMeal);       // POST /api/meals/new

export default route;