import { User } from "../models/user";
import { Request } from "express"; 

export class UserService {
    public async dashboard(req:Request|any){
        const user = await User.findOne({where:{id:req.user.id}})
        return user;
    }
    public async profile(id : any){
        const userid = id
        const profile = await User.findOne({where:{id:userid}})
        return profile;
    }
    public async getAllUsers(){
        const users = await User.findAll();
        return users;
    }
    public async editProfile(req:Request,id:string){
        const userid = id
        const { username, email } = req.body
        const user = await User.update({
            username,
            email,
        },{where:{id:userid}})
        return user
    }
    public async deleteUser(id:string){
        const deleteUser = await User.destroy({where:{id}})
        return deleteUser
    }
}