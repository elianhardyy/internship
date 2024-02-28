import { DataTypes, Model, Optional } from "sequelize";

import { database } from "../config/database.config";



interface BlacklistAttributes {
    id: number;
    user_id: number|undefined;
  }
  
interface BlacklistCreationAttributes extends Optional<BlacklistAttributes, 'id'> {}
  
export class Blacklist extends Model<BlacklistAttributes, BlacklistCreationAttributes> implements BlacklistAttributes {
    id!: number;
    user_id!: number|undefined;
}

Blacklist.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        user_id:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        timestamps:true,
        sequelize:database
    }
)