import express from "express";
import user from "../routes/route";

const api = express();

//user
api.use("/user",user)



export default api;