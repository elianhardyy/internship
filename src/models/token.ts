import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../config/config";

interface TokenAttributes {
    id: number;
    userId: number|undefined;
    token: string;
    expires_at:Date
  }
  
interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {}
  
export class Token extends Model<TokenAttributes, TokenCreationAttributes> implements TokenAttributes {
    id!: number;
    userId!: number|undefined;
    token!: string;
    expires_at!: Date;
    
    // Other methods, associations, etc.
  }
Token.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        token:{
            type:DataTypes.STRING,
            allowNull:false
        },
        expires_at:{
            type:DataTypes.DATE
        }
    },{
        timestamps:true,
        sequelize:database,
        tableName:"tokens"
    }
)