import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
const DATABASE = process.env.DATABASE!;
const USER = process.env.USER!;
const PASSWORD = process.env.PASSWORD!;
const HOST = process.env.HOST!;
const DIALECT : any= process.env.DIALECT;


export const database = new Sequelize(DATABASE,USER,PASSWORD,{
    host:HOST,
    dialect:DIALECT,
})