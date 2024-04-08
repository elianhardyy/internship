import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Blacklist } from "../models/blacklist";
import { Token } from "../models/token";
class AuthenticationMiddleware {
    public async verifyToken(req: any, res:Response, next:NextFunction) : Promise<Response|void>{
        let token = req.headers.authorization?.split(" ")[1];
        //token.exp or token.iat
        if(!token){
            return res.status(403).send({
                message:"token not valid"
            })
        }
        try {
            const verified : any= jwt.verify(token,process.env.SECRET_JWT!);
            // console.log(req.session.authenticated)
            // if(req.session.authenticated){
                
            // }else{
            //     return res.status(403).json({message:'bad request'})
            // }
            if(verified){
                req.user = verified
                await Blacklist.destroy({where:{userId:req.user.id}})
                const userblacklist = await Blacklist.findOne({where:{userId:verified.id}})
                const tokenAuth = await Token.findOne({where:{
                    userId:req.user.id,
                    token:token,
                }})
                // if(!tokenAuth){
                //     return res.status(403).json({message:"you must login first"});
                // }
                // else if(token != tokenAuth.token){
                //     return res.status(403).json({message:"your token not verified"})
                // }
                if(tokenAuth!!.expires_at <= new Date(Date.now())){
                    await Token.destroy({where:{userId:req.user.id}})
                    return res.status(403).json({message:"you can't login"})
                }else{
                    if(userblacklist){
                        return res.status(403).json({message:"you have been logged out"});
                    }
                    next();
                }
            }
        } catch (error) {
            return res.status(401).send({
                message:"Unauthorized",
                error
            })
        }
    }
    public async validation(req: Request | any, res:Response, next:NextFunction) : Promise<Response<any,Record<string,any>> | undefined> {
        const errors = validationResult(req)
        if(req.session.authenticated){
            return res.status(403).json({message:"you've already login"});
        }else{
            if(!errors.isEmpty()){
                let error = errors.array().map((err)=>{return err.msg})
                return res.status(422).json({error})
            }

        }
        next()
    }
}

export default new AuthenticationMiddleware();