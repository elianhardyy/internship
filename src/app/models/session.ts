import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../../config/config";

interface SessionAttributes {
    id: number;
    userId: number|undefined;
    payload:string,
    ipAddress:string,
    userAgent:string,
    expires_at:Date
  }
  
interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}
  
export class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    id!: number;
    userId!: number|undefined;
    payload!: string;
    ipAddress!: string;
    userAgent!: string;
    expires_at!: Date;
}

Session.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        userId:{
            type:DataTypes.INTEGER,
        },
        payload:{
            type:DataTypes.STRING,
        },
        ipAddress:{
            type:DataTypes.STRING
        },
        userAgent:{
            type:DataTypes.STRING
        },
        expires_at:{
            type:DataTypes.DATE
        }
        
    },{
        timestamps:true,
        sequelize:database,
        tableName:"sessions"
    }
)