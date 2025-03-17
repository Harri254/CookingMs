import { Router } from "express";
import gettingAllMeals from "../controllers/meals/getMeals.controller.js";
import addingMeal from "../controllers/meals/addMeal.controller.js";
const route = Router();

route.get("/meal", gettingAllMeals).post("/meals", addingMeal);

export default route;
