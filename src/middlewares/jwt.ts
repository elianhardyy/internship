import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

class JwtAuthentication {
    public async verifyToken(req: Request | any, res:Response, next:NextFunction){
        let token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(403).send({
                message:"token not valid"
            })
        }
        try {
            const verified = jwt.verify(token,"secret");
            if(verified){
                req.user = verified
                return next();
            }
        } catch (error) {
            return res.status(401).send({
                message:"Unauthorized",
                error
            })
        }
    }
}

export default new JwtAuthentication