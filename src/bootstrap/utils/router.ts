import express from "express";
import user from "../../routes/user.route";
import auth from "../../routes/auth.route";

const router = express();

//user
router.use("/user",user)
router.use("/auth",auth)



export default router;