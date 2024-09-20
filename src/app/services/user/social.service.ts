import { google } from "googleapis";
import { Response } from "express";
import { User } from "../../models/user";
import { Env } from "../../../bootstrap/utils/helper";
import { UserRole } from "../../models/user_role";
import { accessSignJwt } from "../../../bootstrap/utils/jwt.utils";

const oauth2Client = new google.auth.OAuth2(
  Env("GOOGLE_CLIENT_ID"),
  Env("GOOGLE_CLIENT_SECRET"),
  //"https://api-elian-app.vercel.app/api/v1/auth/google/callback"
  "http://localhost:5000/api/v1/auth/google/callback"
);
const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
export const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});
export class SocialService {
  // auth/google GET
  public async authorizationGoogle(res: Response) {
    return res.redirect(authorizationUrl);
  }
  //auth/google/callback GET
  public async callbackAuth(query: any) {
    const { code } = query;
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    const { data } = await oauth2.userinfo.get();
    console.log(data);
    if (!data.email || !data.name) {
      return data;
    }
    var user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      user = await User.create({
        username: data.name,
        email: data.email,
      });
    }
    const userRole = await UserRole.findOne({
      where: { userId: user?.id },
    });
    const payload = {
      id: user?.id,
      sub: user?.email,
      role: userRole?.roleId,
    };

    const token = accessSignJwt(payload);
    return {
      data: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
      token: token,
    };
  }
}
