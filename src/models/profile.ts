import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../config/config";
interface ProfileAttributes {
    id: number;
    userId: number|undefined;
    image:string;
  }
  
interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}
  
export class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
    id!: number;
    userId!: number|undefined;
    image!: string;
}

Profile.init(
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
        },
        image:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },{
        timestamps:true,
        sequelize:database
    }
)