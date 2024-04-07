import { Blacklist } from "../models/blacklist";
import { Profile } from "../models/profile";
import { Role } from "../models/role";
import { Session } from "../models/session";
import { Token } from "../models/token";
import { User } from "../models/user";
import { UserRole } from "../models/user_role";
import { database } from "./config";

export const dbconfig = [
    User.hasOne(Blacklist,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"}),
    Blacklist.belongsTo(User,{
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        foreignKey:'userId'
    }),
    User.hasMany(Token,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"}),
    Token.belongsTo(User,{onDelete:'CASCADE',onUpdate:'CASCADE',foreignKey:"userId"}),

    User.belongsToMany(Role,{through:UserRole,onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:'userId'}),
    Role.belongsToMany(User,{through:UserRole,onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:'roleId'}),

    User.hasOne(Profile,{onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:"userId"}),
    Profile.belongsTo(User,{onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:"userId"}),

    User.hasMany(Session,{onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:"userId"}),
    Session.belongsTo(User,{onDelete:"CASCADE",onUpdate:"CASCADE",foreignKey:"userId"}),
    database.sync()
]