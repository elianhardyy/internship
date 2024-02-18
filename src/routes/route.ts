import express from "express"
import UserController from "../controllers/user.controller";
import JwtAuthentication from "../middlewares/jwt";
import { userRegister,userLogin,validate, editUser } from "../middlewares/validation";

const user = express.Router();


//authentication
user.post('/register',userRegister,validate,UserController.create);
user.post('/login',userLogin,validate,UserController.login);
//user.post('/logout',JwtAuthentication.verifyToken,UserController.logout)
//user
user.get('/dashboard',JwtAuthentication.verifyToken,UserController.index)
user.get("/profile/:id",JwtAuthentication.verifyToken,UserController.detail)
user.get("/all",JwtAuthentication.verifyToken,UserController.users)
user.put("/update/:id",editUser,JwtAuthentication.verifyToken,UserController.update);
user.delete("/delete/:id",JwtAuthentication.verifyToken,UserController.destroy)

export default user