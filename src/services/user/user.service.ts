import { UserRequest } from "../../interfaces/user.interface";
import { User } from "../../models/user";
import { Request } from "express"; 
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3 } from "../../utils/files";
import { FileRequest } from "../../interfaces/file.interface";
import crypto from 'crypto'
import sharp from "sharp";
import { Profile } from "../../models/profile";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export class UserService {
    public async dashboard(req:UserRequest) : Promise<User|null>{
        const user: User|null = await User.findOne({where:{id:req.user.id}})
        return user;
    }
    public async profile(id : string):Promise<User|null>{
        const userid = id
        const profile = await User.findOne({where:{id:userid}})
        return profile;
    }
    public async getAllUsers() : Promise<User[]>{
        const users = await User.findAll();
        return users;
    }
    public async editProfile(user:User,id:string) : Promise<[affectedCount:number]>{
        const userupdate = await User.update({
            username:user.username,
            email:user.email,
        },{where:{id}})
        return userupdate
    }
    public async deleteUser(id:string):Promise<number>{
        const deleteUser = await User.destroy({where:{id}})
        return deleteUser
    }

    public async postProfile(req:any){
        const randomImageName = crypto.randomBytes(32).toString('hex')
        const buffer = await sharp(req.file?.buffer).resize({height:1920, width:1080, fit:"contain"}).toBuffer();
        const command = new PutObjectCommand({
            Bucket:bucketName,
            Key:randomImageName,
            Body:buffer,
            ContentType:req.file?.mimetype
        })
        
        await s3.send(command)

        const profile = Profile.create({
            userId:req.user.id,
            image:randomImageName
        })
        return profile;
    }

    public async getProfile(){
        const profile = await Profile.findAll();
        for(const pro of profile){
            const command = new GetObjectCommand({
                Bucket:bucketName,
                Key:pro.image
            })
            const url = await getSignedUrl(s3,command,{expiresIn:360000})
            pro.image = url
        }
        return profile
    }

    public async deleteProfile(user:any,res:any){
        const {id} = user
        const profile = await Profile.findOne({where:{userId:id}})
        if(!profile){
            return res.status(404).send('not found')
        }
        const command = new DeleteObjectCommand({
            Bucket:bucketName,
            Key:profile.image
        })
        await s3.send(command);
        return "delete success";
    }
}