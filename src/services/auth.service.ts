import { Request, Response } from "express";
import { User } from "../models/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken"
import { accessSignJwt, refreshSignJwt } from "../utils/jwt.utils";
import { TokenData } from "../utils/jwt.utils"; 
import { Token } from "../models/token";
import { Blacklist } from "../models/blacklist";
import { UserRequest } from "../interfaces/user.interface";
import { Session } from "express-session";

export class AuthService {
    public async register(user:User) : Promise<User>{ 
        const users = User.create({
            username:user.username,
            email:user.email,
            password:user.password
        })
        return users
    }
    public async login(user:User, res:Response, session:Session|any) : Promise<TokenData>{
            const findEmail:User|null = await User.findOne({where:{email : user.email}})
            const comparePassword = bcrypt.compareSync(user.password,findEmail!.password);
            if(!findEmail && !comparePassword){
                res.status(401).send({message:"Invalid email or password"})
            }
            const payload = {
                id:findEmail?.id,
                sub:findEmail?.email
            }
            const expired = new Date(Date.now()+60000)
            session.cookie.expires = expired;
            session.cookie.maxAge = 60000;
            session.authenticated = true
            
            const refresh = refreshSignJwt(payload);
            const refreshTokenExp = new Date(Date.now()+60000);
            res.cookie('refreshToken',refresh,{
                maxAge:60*60*1
            })
            await Token.create({
                user_id:findEmail?.id,
                token:refresh,
                expires_at:refreshTokenExp
            })
            const token = accessSignJwt(payload);
            session.user = {
                username:user.username,
                email:user.email,
                accessToken:token,
                refreshToken:refresh
            }
            return {refreshToken:refresh, accessToken: token};
    }

    public async logout(req:Request|any, res:Response):Promise<any>{
        const expired = new Date(Date.now())
        await Blacklist.create({
            user_id:req.user.id
        })
        req.session.cookie.expires = expired
        req.session.cookie.maxAge = 0;
        req.session.authenticated = false
        req.session.destroy((err:Error)=>{
            if(err){
                return err.message
            }else{
                return res.status(200).json({msg:"session deleted"});
            }
        })
    }

}