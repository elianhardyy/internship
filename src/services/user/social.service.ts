import { google } from "googleapis"
import { Response } from "express"
import { User } from "../../models/user"

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://api-elian-app.vercel.app/api/v1/auth/google/callback'
)

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

export const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type:'online',
    scope:scopes,
    include_granted_scopes:true
})

export class SocialService{
    // auth/google GET
    public async authorizationGoogle(res:Response){
        return res.redirect(authorizationUrl);
    }
    //auth/google/callback GET
    public async callbackAuth(query:any){
        const {code} = query;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens)
        const oauth2 = google.oauth2({
            auth:oauth2Client,
            version:'v2'
        })
        const { data } = await oauth2.userinfo.get();
        console.log(data);
        if(!data.email || !data.name){
            return data;
        }
        let user = await User.findOne({where:{email:data.email}})
        if(!user){
            user = await User.create({
                username:data.name,
                email:data.email,
            })
            return user
        }
    }
}