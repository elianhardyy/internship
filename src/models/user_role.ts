import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../config/database.config";

export interface UserRoleAttributes{
    id:number;
    userId:number;
    roleId:number
}
interface UserRoleCreationAttributes extends Optional<UserRoleAttributes,'id'>{
}

export class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes{
    id!: number;
    userId!: number;
    roleId!: number;
}

UserRole.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    roleId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:2
    }
},{
    timestamps:true,
    sequelize:database,
    tableName:'user_roles'
})