import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import { Env } from "../utils/helper";


const DATABASE = Env("RDS_DATABASE");
const USER = Env("RDS_USER");
const PASSWORD = Env("RDS_PASSWORD");
const HOST = Env("RDS_HOSTNAME");
const DIALECT : any= Env("DIALECT");

export const database = new Sequelize(DATABASE,USER,PASSWORD,{
    host:HOST,
    dialect:DIALECT,
    dialectModule:mysql2,
    timezone:"+07:00"
})