import express from "express"
import UserController from "../controllers/user.controller";
import AuthneticationMiddleware from "../middlewares/validation";
import { userRegister,userLogin, editUser } from "../schema/user";

const user = express.Router();

//authentication
user.post('/register',userRegister,AuthneticationMiddleware.validation,UserController.create);
user.post('/login',userLogin,AuthneticationMiddleware.validation,UserController.login);
user.post('/logout',AuthneticationMiddleware.verifyToken,UserController.logout);
//user
user.get('/dashboard',AuthneticationMiddleware.verifyToken,UserController.index)
user.get("/profile/:id",AuthneticationMiddleware.verifyToken,UserController.detail)
user.get("/all",AuthneticationMiddleware.verifyToken,UserController.users)
user.put("/update/:id",editUser,AuthneticationMiddleware.validation,AuthneticationMiddleware.verifyToken,UserController.update);
user.delete("/delete/:id",AuthneticationMiddleware.verifyToken,UserController.destroy)

export default user