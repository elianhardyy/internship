import express from "express";
import user from "../routes/user.route";

const router = express();

//user
router.use("/user",user)



export default router;