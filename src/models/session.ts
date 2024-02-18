import { DataTypes, Model } from "sequelize"
import { database } from "../config/database.config"

export interface ISession {
    userid:number,
    token:string
    expires_at:string
}

export class Session extends Model implements ISession{
    public userid!: number
    public token!: string
    public expires_at!: string
}

Session.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true
        }
    },{
        sequelize:database
    }
)
