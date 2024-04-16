import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../../config/config";

interface BlacklistAttributes {
    id: number;
    userId: number|undefined;
  }
  
interface BlacklistCreationAttributes extends Optional<BlacklistAttributes, 'id'> {}
  
export class Blacklist extends Model<BlacklistAttributes, BlacklistCreationAttributes> implements BlacklistAttributes {
    id!: number;
    userId!: number|undefined;
}

Blacklist.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        timestamps:true,
        sequelize:database,
        tableName:"blacklists"
    }
)