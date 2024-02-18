import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { IUser, User } from "../models/user";

class UserController {
    public async create(req : Request, res: Response) : Promise<Response>{
        const service = new AuthService();
        const usees : IUser = req.body
        const user = await service.register(usees);
        return res.status(201).json({
            data : user
        })
    }
    public async login(req:Request, res:Response) : Promise<Response> {
        const service = new AuthService();
        const login = await service.login(req,res);
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
        const user = await service.editProfile(req, req.params.id)
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