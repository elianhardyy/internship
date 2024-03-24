import { UserRequest } from "../interfaces/user.interface"
import { NextFunction, Response } from "express"
import { UserRole } from "../models/user_role"
import { Role } from "../models/role"
import { Roles } from "../enums/role"

export const permission = async(...roles:any[]) => {
    return async(req:UserRequest, res:Response, next:NextFunction)=>{
        const roleData = await UserRole.findOne({where:{userId:req.user.id}})
        const getRole = await Role.findOne({where:{id:roleData?.roleId}})
        const roleName  = getRole?.name;
        if(!roles.includes(roleName as string)){
            return next(res.status(403).json({
                status:403,
                error:"not permitted"
            }))
        }
        next();
    }
}

