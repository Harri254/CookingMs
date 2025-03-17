import { Router } from "express";
import adminLoging from "../controllers/users/adminLogin.controller.js";
import adminCreateUser from "../controllers/users/adminCreateUser.controller.js";
import manageUsers from "../controllers/users/manageUsers.controller.js";
import delUsers from "../controllers/users/delUser.controller.js";

const route = Router()
route.post('/login', adminLoging);
route.post('/addUser', adminCreateUser);
route.get('/mngUsers', manageUsers);
route.delete('/mngUsers/del/:userId', delUsers);


export default route;