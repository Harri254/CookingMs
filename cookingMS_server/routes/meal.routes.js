import { Router } from "express";
import upload from "../middleware/multerConfig.js";
import gettingAllMeals from "../controllers/meals/getMeals.controller.js";
import addingMeal from "../controllers/meals/addMeal.controller.js";
import gettingMealById from "../controllers/meals/getMealbyId.controller.js";
import updatingMeal from "../controllers/meals/updateMeal.controller.js";
import deletingMeal from "../controllers/meals/deleteMeal.controller.js";

const route = Router();

route.get("/", gettingAllMeals); // Fetch all meals
route.post("/new", upload.single("image"), addingMeal); // Add a new meal
route.get("/:id", gettingMealById); // Fetch a specific meal by ID
route.put("/:id", upload.single("image"), updatingMeal); // Update a meal
route.delete("/:id", deletingMeal); // Delete a meal by ID

export default route;