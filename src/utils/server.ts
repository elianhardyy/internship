import express from "express";
import router from "./router";
import session from 'express-session'
import cookieParser from 'cookie-parser';
import cors from "cors"
import { dbconfig } from "../config/database";
import { Request, Response } from "express";
export const server = () =>{
    const app = express()
    dbconfig
    app.use(cors({
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
    }))
    app.use((req,res,next)=>{
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next();
    })
    app.use(session({
        secret:process.env.SECRET_JWT!,
        resave: true,
        saveUninitialized: true,
        cookie:{maxAge:86400000},
    }))
    app.use(express.urlencoded({extended:true})),
    app.use(express.json());
    app.use(cookieParser())
    app.use("/api/v1",router)
    app.get("/",function(req:Request, res:Response){
        res.send(
            "<p>REGISTER : (POST) https://api-elian-app.vercel.app/api/v1/auth/register</p><br><p>LOGIN : (POST) https://api-elian-app.vercel.app/api/v1/auth/login</p><br><p>DASHBOARD : (GET) https://api-elian-app.vercel.app/api/v1/user/dashboard</p><br><p>LOGOUT : (POST) https://api-elian-app.vercel.app/api/v1/auth/logout</p>"
        );
    })

    return app;
} 