import express from "express";
import router from "./router";
import session from 'express-session'
import cookieParser from 'cookie-parser';
import cors from "cors"
import { dbconfig } from "../config/database";
export const server = () =>{
    const app = express()
    dbconfig
    app.use(cors({
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
    }))
    app.use(session({
        secret:process.env.SECRET_SESSION!,
        cookie:{maxAge:360000},
    }))
    app.use(express.urlencoded({extended:true})),
    app.use(express.json());
    app.use(cookieParser())
    app.use("/api/v1",router)

    return app;
} 