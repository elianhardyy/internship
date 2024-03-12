import express from "express"
import UserController from "../controllers/user.controller";
import AuthenticationMiddleware from "../middlewares/validation";
import { userRegister,userLogin, editUser } from "../schema/user";

const user = express.Router();

//user
user.get('/dashboard',AuthenticationMiddleware.verifyToken,UserController.index)
user.get("/profile/:id",AuthenticationMiddleware.verifyToken,UserController.detail)
user.get("/all",AuthenticationMiddleware.verifyToken,UserController.users)
user.put("/update/:id",editUser,AuthenticationMiddleware.validation,AuthenticationMiddleware.verifyToken,UserController.update);
user.delete("/delete/:id",AuthenticationMiddleware.verifyToken,UserController.destroy)

export default user