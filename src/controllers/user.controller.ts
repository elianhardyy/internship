import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUser, User } from "../models/user";

class UserController {
    public async create(req : Request, res: Response) : Promise<Response>{
        const service = new AuthService();
        const users : IUser = req.body
        const user = await service.register(users);
        return res.status(201).json({
            data : user
        })
    }
    public async login(req:Request, res:Response) : Promise<Response> {
        const service = new AuthService();
        const user : IUser = req.body
        const login = await service.login(user,res);
        return res.status(201).json({
            token:login
        })
    }
    public async index(req: Request, res:Response) : Promise<Response> {
        const service = new UserService();
        const dashboard = await service.dashboard(req);
        return res.status(200).json({
            data:dashboard
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
        const edituser : IUser = req.body
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
}
export default new UserController();