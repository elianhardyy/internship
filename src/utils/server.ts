import express from "express";
import router from "./router";
import session from 'express-session'
import cookieParser from 'cookie-parser';
import cors from "cors"
import { dbconfig } from "../config/database";
import { Request, Response } from "express";
import { Env } from "./helper";
export const server = () =>{
    const app = express()
    const prodClientOrigin = Env("ORIGIN_1")
    const devClientOrigin = Env("LOCAL_SERVER")
    const bothOrigin = [prodClientOrigin,devClientOrigin]
    const allowedOrigins = Env('NODE_ENV') === 'production' ? prodClientOrigin : devClientOrigin
    app.use(cors({
        origin:bothOrigin,
        optionsSuccessStatus:200,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
        //allowedHeaders:"Origin, X-Requested-With, Content-Type, Accept, Authorization"
    }))
    app.use(express.urlencoded({extended:true})) // URLs can only be sent over the Internet using the ASCII character-set. Since URLs often contain characters outside the ASCII set, the URL has to be converted into a valid ASCII format.
    app.use(express.json())
    app.use(cookieParser())
    app.use(session({
        secret:process.env.SECRET_JWT!,
        resave: true,
        saveUninitialized: true,
        cookie:{maxAge:86400000},
    }))
    dbconfig
    app.use("/api/v1",router)
    app.get("/",function(req:Request, res:Response){
        res.send(
            "<p>REGISTER : (POST) https://api-elian-app.vercel.app/api/v1/auth/register</p><br><p>LOGIN : (POST) https://api-elian-app.vercel.app/api/v1/auth/login</p><br><p>DASHBOARD : (GET) https://api-elian-app.vercel.app/api/v1/user/dashboard</p><br><p>LOGOUT : (POST) https://api-elian-app.vercel.app/api/v1/auth/logout</p>"
        );
    })

    return app;
} 