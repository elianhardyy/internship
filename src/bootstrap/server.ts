import express from "express";
import router from "../utils/router";
import session from 'express-session'
import cookieParser from 'cookie-parser';
import cors from "cors"
import { dbconfig } from "../databases/database";
import { Request, Response } from "express";
import { Env } from "../utils/helper";
import { socketInit } from "../utils/socket";
import mqtt from "mqtt";

const username = "hivemq.webclient.1713603395933"
const password = "8w&4HJLv;@thy7M6eVT#"

var client = mqtt.connect({
  hostname:"6cb1df3c593b40828249b433fba92e37.s1.eu.hivemq.cloud",
  port:8883,
  protocol:'mqtt',
  username:"hivemq.webclient.1713603395933",
  password:"8w&4HJLv;@thy7M6eVT#"
})

export const server = () =>{
    const app = express()
    
    //socketInit(app);
    const prodClientOrigin = Env("ORIGIN_1")
    const devClientOrigin = Env("LOCAL_SERVER")
    const bothOrigin = [prodClientOrigin,devClientOrigin]
    //const allowedOrigins = Env('NODE_ENV') === 'production' ? prodClientOrigin : devClientOrigin
    //optionsSuccessStatus:200,
    app.use(cors({
        origin:bothOrigin,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true,
        allowedHeaders:"Origin, X-Requested-With, Content-Type, Accept, Authorization"
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