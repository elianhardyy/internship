import express from "express";
import { User } from "../models/user";
import route from "./route";

export const server = () =>{
    const app = express()

    User.sync()

    app.use(express.urlencoded({extended:true})),
    app.use(express.json());
    app.use("/api/v1",route)

    return app;
} 