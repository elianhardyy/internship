import { IUser, User } from "../models/user";
import { Request } from "express"; 

export class UserService {
    public async dashboard(req:Request|any) : Promise<User|null>{
        const user: User|null = await User.findOne({where:{id:req.user.id}})
        return user;
    }
    public async profile(id : string):Promise<User|null>{
        const userid = id
        const profile = await User.findOne({where:{id:userid}})
        return profile;
    }
    public async getAllUsers() : Promise<User[]>{
        const users = await User.findAll();
        return users;
    }
    public async editProfile(user:IUser,id:string) : Promise<[affectedCount:number]>{
        const userupdate = await User.update({
            username:user.username,
            email:user.email,
        },{where:{id}})
        return userupdate
    }
    public async deleteUser(id:string):Promise<number>{
        const deleteUser = await User.destroy({where:{id}})
        return deleteUser
    }
}