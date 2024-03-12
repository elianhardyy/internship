import { Request, Response } from "express";
import { User, UserAttributes } from "../models/user";
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
        const users = await User.create({
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
        const expired = new Date(Date.now()+360000)
        session.cookie.expires = expired;
        session.cookie.maxAge = 360000;
        session.authenticated = true
        
        const refresh = refreshSignJwt(payload);
        const refreshTokenExp = new Date(Date.now()+360000);
        res.cookie('refreshToken',refresh,{
            maxAge:360000
        })
        await Token.create({
            userId:findEmail?.id,
            token:refresh,
            expires_at:refreshTokenExp
        })
        const token = accessSignJwt(payload);
        res.cookie('accessToken',token,{
            maxAge:360000
        })
        session.user = {
            username:user.username,
            email:user.email,
            accessToken:token,
            refreshToken:refresh
        }
        return {refreshToken:refresh, accessToken: token};
    }

    public async refresh(req:UserRequest,res:Response):Promise<Response>{
        const refreshToken = req.cookies['refreshToken'];
        const payload: any = jwt.verify(refreshToken,process.env.REFRESH_JWT!);
        if(!payload){
            return res.status(401).json({
                message:"Token not found"
            })
        }
        const dbToken = await Token.findOne({where:{userId:payload.id}})
        if(!dbToken){
            return res.status(401).json({
                message:"user not found"
            })
        }
        const newPayload = {
            id:payload.id
        }
        const token = accessSignJwt(newPayload);
        return res.json({token});
    }

    public async logout(req:Request|any, res:Response):Promise<any>{
        const expired = new Date(Date.now())
        await Blacklist.create({
            userId:req.user.id
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