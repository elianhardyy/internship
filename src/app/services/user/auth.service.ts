import { Request, Response } from "express";
import { User, UserAttributes } from "../../models/user";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import {
  accessSignJwt,
  refreshSignJwt,
} from "../../../bootstrap/utils/jwt.utils";
import { TokenData } from "../../../bootstrap/utils/jwt.utils";
import { Token } from "../../models/token";
import { Blacklist } from "../../models/blacklist";
import { UserRequest } from "../../../interfaces/user.interface";
import { Session } from "express-session";
import { UserRole } from "../../models/user_role";
export class AuthService {
  public async register(user: User, res: Response): Promise<any> {
    const findEmail = await User.findOne({ where: { email: user.email } });
    if (findEmail) {
      return res.status(400).json({
        status: 400,
        message: "email is already taken",
        data: "not found",
      });
    } else {
      const users = await User.create({
        username: user.username,
        email: user.email,
        password: user.password,
      });
      return res
        .status(201)
        .json({ status: 201, message: "successfull", data: users });
    }
  }
  public async login(
    user: User,
    res: Response | any,
    session: Session | any
  ): Promise<TokenData | Response> {
    const findEmail: User | null = await User.findOne({
      where: { email: user.email },
    });
    if (!findEmail) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }
    const comparePassword = bcrypt.compareSync(
      user.password,
      findEmail!.password
    );
    if (!comparePassword) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }
    const userRole = await UserRole.findOne({
      where: { userId: findEmail?.id },
    });
    const payload = {
      id: findEmail?.id,
      sub: findEmail?.email,
      role: userRole?.roleId,
    };
    const token = accessSignJwt(payload);
    const expired = new Date(Date.now() + 86400000);
    // session.cookie.expires = expired;
    // session.cookie.maxAge = 86400000;
    // session.authenticated = true

    const refresh = refreshSignJwt(payload);
    const refreshTokenExp = new Date(Date.now() + 86400000);

    await Token.create({
      userId: findEmail?.id,
      token: refresh,
      expires_at: refreshTokenExp,
    });
    session.user = {
      username: user.username,
      email: user.email,
      accessToken: token,
      refreshToken: refresh,
    };
    res.cookie("refreshToken", refresh, {
      maxAge: 86400000,
      withCredentials: true,
      httpOnly: false,
    });
    res.cookie("accessToken", token, {
      maxAge: 86400000,
      // withCredentials: true,
      // httpOnly: false,
    });
    //res.cookie("token",token);
    return res.status(200).json({ refreshToken: refresh, accessToken: token });
  }

  public async refresh(req: UserRequest, res: Response): Promise<Response> {
    const refreshToken = req.cookies["refreshToken"];
    const payload: any = jwt.verify(refreshToken, process.env.REFRESH_JWT!);
    if (!payload) {
      return res.status(401).json({
        message: "Token not found",
      });
    }
    const dbToken = await Token.findOne({ where: { userId: payload.id } });
    if (!dbToken) {
      return res.status(401).json({
        message: "user not found",
      });
    }
    const newPayload = {
      id: payload.id,
    };
    const token = accessSignJwt(newPayload);
    return res.json({ token });
  }

  public async logout(req: Request | any, res: Response): Promise<any> {
    const expired = new Date(Date.now());
    let token = req.cookies["refreshToken"];
    // await Blacklist.create({
    //     userId:req.user.id
    // })
    req.session.cookie.expires = expired;
    req.session.cookie.maxAge = 0;
    req.session.authenticated = false;
    if (!token) {
      return res.status(401).json({ message: "token not found" });
    }
    await Token.destroy({
      where: {
        userId: req.user.id,
        token,
      },
    });
    req.session.destroy((err: Error) => {
      if (err) {
        return err.message;
      } else {
        //const exptoken = new Date(req.user.exp);
        //console.log(exptoken);
        res.cookie("accessToken", "", {
          expires: new Date(0),
        });
        res.cookie("refreshToken", "", {
          expires: new Date(0),
        });

        return res.status(200).json({ msg: "logout success" });
      }
    });
  }
}
