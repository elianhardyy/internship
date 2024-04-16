import { Blacklist } from "../app/models/blacklist";
import { Profile } from "../app/models/profile";
import { Role } from "../app/models/role";
import { Session } from "../app/models/session";
import { Token } from "../app/models/token";
import { User } from "../app/models/user";
import { UserRole } from "../app/models/user_role";
import { database } from "../config/config";

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