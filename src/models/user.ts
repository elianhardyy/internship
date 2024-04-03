import { DataTypes, Model, Optional } from "sequelize";
import * as bcrypt from "bcrypt";
import { database } from "../config/config";
import { UserRole } from "./user_role";
import { Role } from "../enums/role";

export interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password:string|null
  }
  
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
  
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!:string;
    // Other methods, associations, etc.
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
            allowNull: false,
            unique:true,
            validate:{
                isEmail:true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
            validate:{
                min:8,
            }
        }
    },
    {
        timestamps:true,
        sequelize : database,
        tableName:'users',
        hooks:{
            beforeCreate: (user,options)=>{
                const salt = bcrypt.genSaltSync(10)
                if(!user.password){
                    user.password = ""
                }else{
                    const hashedPassword = bcrypt.hashSync(user.password, salt)
                    user.password = hashedPassword
                }
            },
            afterCreate:async(user,options)=>{
                await UserRole.create({
                    userId:user?.id,
                    roleId:Role.USER
                })
            }
        }
        
    }
)

