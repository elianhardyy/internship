import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { User } from "../models/user";
import { RequestRedirect } from "undici-types";
import { UserRequest } from "../interfaces/user.interface";
import { SocialService } from "../services/social.service";


class UserController {
    public async create(req : Request, res: Response) : Promise<Response>{
        const service = new AuthService();
        const users : User = req.body
        const user = await service.register(users);
        return res.status(201).json({
            data : user
        })
    }

    public async login(req:Request|any, res:Response) : Promise<Response|undefined> {
        const service = new AuthService();
        const user : User = req.body
        const session = req.session;
        const login = await service.login(user,res,session);        
        //res.cookie('jwt',login,{expires:expired});
        return res.json(login);
    }
    public async refresh(req:Request|any,res:Response){
        const service = new AuthService();
        const refresh = await service.refresh(req,res)
        return refresh;
    }
    public async index(req: UserRequest|any, res:Response) : Promise<Response> {
        const service = new UserService();
        const dashboard = await service.dashboard(req);
        return res.status(200).json({
            data:dashboard,
        })
    }
    public async detail(req: Request, res:Response) : Promise<Response> {
        const service = new UserService();
        const profile = await service.profile(req.params.id);
        return res.status(200).json({
            data:profile
        })
    }
    public async users(req:Request,res:Response) : Promise<Response> {
        const service = new UserService();
        const users = await service.getAllUsers();
        return res.status(200).json({
            data:users
        })
    }

    public async update(req:Request, res:Response) : Promise<Response> {
        const service = new UserService();
        const edituser : User = req.body
        const user = await service.editProfile(edituser, req.params.id)
        return res.status(201).json({
            data:user
        })
    }

    public async destroy(req:Request, res:Response) : Promise<Response> {
        const service = new UserService();
        await service.deleteUser(req.params.id)
        return res.status(200).json({message:"delete succeed"})
    }

    public async logout(req:Request, res:Response){
        const service = new AuthService();
        await service.logout(req,res);
    }

    public async googleAuth(req:Request,res:Response){
        const service = new SocialService();
        return service.authorizationGoogle(res)
    }

    public async googleCallback(req:Request,res:Response){
        const service = new SocialService();
        const data = await service.callbackAuth(req.query);
        return res.json({data});
    }
}
export default new UserController();