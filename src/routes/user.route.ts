import express from "express"
import UserController from "../controllers/user.controller";
import AuthenticationMiddleware from "../middlewares/validation";
import { userRegister,userLogin, editUser } from "../schema/user";
import {permission} from "../middlewares/role";
import { Role } from "../enums/role";
import { upload } from "../utils/files";


const user = express.Router();
//user
user.get('/dashboard',AuthenticationMiddleware.verifyToken,UserController.index)
user.get("/profile/:id",AuthenticationMiddleware.verifyToken,UserController.detail)
user.get("/all",AuthenticationMiddleware.verifyToken,UserController.users)
user.put("/update/:id",editUser,AuthenticationMiddleware.validation,AuthenticationMiddleware.verifyToken,UserController.update);
user.delete("/delete/:id",AuthenticationMiddleware.verifyToken,UserController.destroy)
user.post("/profile",AuthenticationMiddleware.verifyToken,upload.single('image'),UserController.myProfile)
user.get("/all/profiles",AuthenticationMiddleware.verifyToken,permission(["admin"]),UserController.getAllProfile)
user.get("/profile/:id",AuthenticationMiddleware.verifyToken,UserController.destroyMyProfile);



export default user