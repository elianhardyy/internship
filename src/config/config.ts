import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
const DATABASE = process.env.RDS_DATABASE!;
const USER = process.env.RDS_USER!;
const PASSWORD = process.env.RDS_PASSWORD!;
const HOST = process.env.RDS_HOSTNAME!;
const DIALECT : any= process.env.DIALECT;


export const database = new Sequelize(DATABASE,USER,PASSWORD,{
    host:HOST,
    dialect:DIALECT,
})