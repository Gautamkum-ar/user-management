import express from "express";
import {
  createUser,
  loginUser,
  updatePassword,
} from "../controller/user-controller.js";
import { checkAuth } from "../middleware/checkAuth.js";

const Router = express.Router();

Router.post("/auth/signup", createUser);
Router.get("/auth/login", loginUser);
Router.post("/profile/update-password", checkAuth, updatePassword);
export default Router;
