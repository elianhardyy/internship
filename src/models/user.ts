import { DataTypes, Model } from "sequelize";
import * as bcrypt from "bcrypt";
import { database } from "../config/database.config";


export interface IUser{
    username:string,
    email:string,
    password:string
}

export class User extends Model implements IUser{
    public username!:string;
    public email!:string;
    public password!:string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps:true,
        sequelize : database,
        tableName:'users',
        hooks:{
            beforeCreate: (user,options)=>{
                const salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(user.password, salt)
                user.password = hashedPassword
            },
        }
        
    }
)