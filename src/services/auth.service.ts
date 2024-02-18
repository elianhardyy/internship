import { Request, Response } from "express";
import { IUser, User } from "../models/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { signJwt } from "../utils/jwt.utils";


export class AuthService {
    public async register(user:IUser){
        const users = User.create({
            username:user.username,
            email:user.email,
            password:user.password
        })
        return users
    }
    public async login(req:Request, res:Response){
            const {email, password} = req.body;
            const findEmail:any = await User.findOne({where:{email}})
            const comparePassword = bcrypt.compareSync(password,findEmail?.password);
            if(!findEmail && !comparePassword){
                res.status(401).send({message:"Invalid email or password"})
            }
            const payload = {
                id:findEmail.id,
                sub:findEmail.email
            }
            const token = signJwt(payload)
            return token;
    }

}