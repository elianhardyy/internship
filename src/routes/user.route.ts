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
  AuthenticationMiddleware.verifyToken,
  UserController.index
);
user.get(
  "/profile/:id",
  AuthenticationMiddleware.verifyToken,
  UserController.detail
);
user.get(
  "/all",
  AuthenticationMiddleware.verifyToken,
  permission(["admin"]),
  UserController.users
);
user.put(
  "/update/:id",
  editUser,
  AuthenticationMiddleware.validation,
  AuthenticationMiddleware.verifyToken,
  UserController.update
);
user.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyToken,
  UserController.destroy
);
user.post(
  "/profile",
  AuthenticationMiddleware.verifyToken,
  upload.single("image"),
  UserController.myProfile
);
user.get(
  "/all/profiles",
  AuthenticationMiddleware.verifyToken,
  permission(["admin"]),
  UserController.getAllProfile
);
user.get(
  "/profile/:id",
  AuthenticationMiddleware.verifyToken,
  UserController.destroyMyProfile
);

export default user;
