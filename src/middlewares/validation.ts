import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
//import { Blacklist } from "../models/blacklist";
import { Token } from "../models/token";
class AuthenticationMiddleware {
    public async verifyToken(req: any, res:Response, next:NextFunction) : Promise<Response|void>{
        let token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(403).send({
                message:"token not valid"
            })
        }
        //token.exp or token.iat
        jwt.verify(token,process.env.SECRET_JWT!,(err:any,verified:any)=>{
            if(err){
                return res.status(401).send({
                    message:"Unauthorized",
                    err
                })
            }
            req.user = verified
            next()
        });
            // if(req.session.authenticated){
                
            // }else{
            //     return res.status(403).json({message:'bad request'})
            // }  
        // await Blacklist.destroy({where:{userId:req.user.id}})   
        //const userblacklist = await Blacklist.findOne({where:{userId:req.user.id}}) 
        
    }
    public async checkToken(req:Request|any, res:Response, next:NextFunction):Promise<any>{
        let token = req.headers.authorization?.split(" ")[1];
        const tokenAuth = await Token.findOne({where:{
                userId:req.user.id,
                token:token,
            }})
            if(!tokenAuth){
                return res.status(403).json({message:"you must login first"});
            }
            else if(token != tokenAuth.token){
                return res.status(403).json({message:"your token not verified"})
            }
            else if(tokenAuth!!.expires_at <= new Date(Date.now())){
                await Token.destroy({where:{userId:req.user.id}})
                return res.status(403).json({message:"you token expired"})
            }else{
                // if(userblacklist){    
                //     return res.status(403).json({message:"you have been logged out"});
                // }
                
                next()
                
            }
    }
    //Promise<Response<any,Record<string,any>> | undefined>
    public async validation(req: Request | any, res:Response, next:NextFunction) : Promise<any> {
        const errors = validationResult(req)
        // if(req.session.authenticated){
        //res.status(403).json({message:"you've already login"});
        // }else{
        if(!errors.isEmpty()){
            let error = errors.array().map((err)=>{return err.msg})
            return res.status(422).json({error})
        }

        // }
        next()
    }
}

export default new AuthenticationMiddleware();