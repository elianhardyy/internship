import express from "express"
import UserController from "../controllers/user.controller";
import AuthenticationMiddleware from "../middlewares/validation";
import { userRegister,userLogin } from "../schema/user";

const auth = express.Router();

//authentication
auth.post('/register',userRegister,AuthenticationMiddleware.validation,UserController.create);
auth.post('/login',userLogin,AuthenticationMiddleware.validation,UserController.login);
auth.post('/logout',AuthenticationMiddleware.verifyToken,UserController.logout);
auth.post('/refresh',UserController.refresh);

//social-authentication
auth.get("/google",UserController.googleAuth);
auth.get("/google/callback",UserController.googleCallback);

export default auth;