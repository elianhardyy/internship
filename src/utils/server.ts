import express from "express";
import { User } from "../models/user";
import router from "./router";
import session from 'express-session'
import { database } from "../config/database.config";
import { Token } from "../models/token";
import { Blacklist } from "../models/blacklist";
import { Role } from "../models/role";
import { UserRole } from "../models/user_role";
import cookieParser from 'cookie-parser';
import cors from "cors"
export const server = () =>{
    const app = express()

    User.hasOne(Blacklist,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"});
    Blacklist.belongsTo(User,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        foreignKey:'userId'
    })

    User.hasMany(Token,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"})
    Token.belongsTo(User,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"});

    User.belongsToMany(Role,{through:UserRole,onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:'userId'});
    Role.belongsToMany(User,{through:UserRole,onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:'roleId'});

    database.sync();
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
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