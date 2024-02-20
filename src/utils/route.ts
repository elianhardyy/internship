import express from "express";
import user from "../routes/route";

const route = express();

//user
route.use("/user",user)



export default route;