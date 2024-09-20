import express from "express";
import UserController from "../app/controllers/user.controller";
import AuthenticationMiddleware from "../app/middlewares/validation";
import { userRegister, userLogin, editUser } from "../app/schema/user";
import { permission } from "../app/middlewares/role";
import { Role } from "../app/enums/role";
import { upload } from "../bootstrap/utils/files";

const user = express.Router();
//user
user.get(
  "/dashboard",
  //AuthenticationMiddleware.checkToken,
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkJWT,
  UserController.index
);
user.get(
  "/profile/:id",
  //AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  UserController.detail
);
user.get(
  "/all",
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  permission(["admin"]),
  UserController.users
);
user.put(
  "/update/:id",
  editUser,
  AuthenticationMiddleware.validation,
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  UserController.update
);
user.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  UserController.destroy
);
user.post(
  "/profile",
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  upload.single("image"),
  UserController.myProfile
);
user.get(
  "/all/profiles",
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  permission(["admin"]),
  UserController.getAllProfile
);
user.get(
  "/profile/:id",
  AuthenticationMiddleware.verifyToken,
  //AuthenticationMiddleware.checkToken,
  UserController.destroyMyProfile
);

export default user;
