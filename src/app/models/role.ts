import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../../config/config";

export interface RoleAttributes{
    id:number;
    name:string;
}
interface RoleCreationAttributes extends Optional<RoleAttributes,'id'>{
}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes{
    id!: number;
    name!: string;
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    timestamps:true,
    sequelize:database,
    tableName:'roles',
})
// Role.bulkCreate([
//     {name:'admin'},
//     {name:'user'}
// ],{returning:true}).then((result)=>{
//     console.log('Role data success')
// }).catch((error:Error)=>{
//     console.log(error.message)
// })