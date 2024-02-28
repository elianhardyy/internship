import { Request } from "express"
import { Session, SessionData } from "express-session"
import { User } from "../models/user"
export interface UserRequest extends Request{
    user:User
}