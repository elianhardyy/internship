import express from "express";
import { User } from "../models/user";
import router from "./router";
import session from 'express-session'
import { database } from "../config/database.config";
import { Token } from "../models/token";
import { Blacklist } from "../models/blacklist";

export const server = () =>{
    const app = express()

    User.hasOne(Blacklist,{onDelete:'CASCADE',onUpdate:'CASCADE'});
    Blacklist.belongsTo(User,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE'
    })

    User.hasMany(Token,{onDelete:'CASCADE',onUpdate:'CASCADE'})
    Token.belongsTo(User,{onDelete:'CASCADE',onUpdate:'CASCADE'});
    database.sync();

    app.use(session({
        secret:process.env.SECRET_SESSION!,
        cookie:{maxAge:60000},
    }))
    app.use(express.urlencoded({extended:true})),
    app.use(express.json());
    app.use("/api/v1",router)

    return app;
} 