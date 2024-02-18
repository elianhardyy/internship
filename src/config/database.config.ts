import { Sequelize } from "sequelize";

export const database = new Sequelize("internship","root","",{
    host:"localhost",
    dialect:"mysql",
})