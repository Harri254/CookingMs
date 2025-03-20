import { Router } from "express";
import addPopulation from "../controllers/population/addOrUpdatePopulation.controller.js";
import getPopulation from "../controllers/population/getPopulation.controller.js";


const route = Router();

route.get("/", getPopulation); 
route.post("/", addPopulation); 

export default route;