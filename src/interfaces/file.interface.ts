import { Request } from "express"
import { Session, SessionData } from "express-session"
import { User } from "../models/user"
export interface FileRequest{
    originalname:string,
    buffer:any,
    mimetype:any
}