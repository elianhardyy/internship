import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { Token } from "../models/token";
import { accessSignJwt, refreshSignJwt } from "../../bootstrap/utils/jwt.utils";
import { Env } from "../../bootstrap/utils/helper";
class AuthenticationMiddleware {
  public async verifyToken(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).send({
        message: "token not valid",
      });
    }
    // res.cookie("accessToken", token, {
    //   maxAge: 36,
    //   // withCredentials: true,
    //   // httpOnly: false,
    // });
    //token.exp or token.iat
    jwt.verify(token, process.env.SECRET_JWT!, (err: any, user: any) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized",
          err,
        });
      }
      //console.log("ini middleware jwt")
      req.user = user;
      next();
    });
  }
  public async checkJWT(req: Request | any, res: Response, next: NextFunction) {
    let tokenRefresh = req.cookies["refreshToken"];
    // const tokenAuth = await Token.findOne({where:{
    //     //userId:req.user.id,
    //     token:tokenRefresh,
    // }})
    if (!tokenRefresh) {
      return res.status(401).json({ message: "token not valid " });
    }
    next();
  }
  public async checkToken(
    req: Request | any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    let tokenVerify = req.cookies["refreshToken"];
    //req.headers.authorization?.split(" ")[1]
    const tokenAuth = await Token.findOne({
      where: {
        token: tokenVerify,
      },
    });
    if (!tokenAuth) {
      return res.status(403).json({ message: "you must login first" });
    } else if (tokenVerify != tokenAuth.token) {
      return res.status(403).json({ message: "your token not verified" });
    } else if (tokenAuth!!.expires_at <= new Date(Date.now())) {
      await Token.destroy({ where: { userId: req.user.id } });
      return res.status(403).json({ message: "you token expired" });
    } else {
      //   const refreshTokenMiddleware = refreshSignJwt(payload);
      //   const refreshTokenExp = new Date(Date.now() + 86400000);
      //   await Token.update(
      //     {
      //       token: refreshTokenMiddleware,
      //       expires_at: refreshTokenExp,
      //     },
      //     { where: { id: payload.id } }
      //   );
      res.cookie("refreshToken", tokenAuth.token, {
        maxAge: 86400000,
      });
      jwt.verify(tokenAuth.token, Env("REFRESH_JWT"), (err: any, user: any) => {
        if (err) {
          return res.status(401).send({
            message: "Unauthorized",
            err,
          });
        } else {
          req.user = user;
          const payload = {
            id: req.user.id, // req.user.id
            sub: req.user.sub,
            role: req.user.role,
          };
          //accessSignJwt(payload);
          let token = req.headers.authorization?.split(" ")[1];
          if (!token) {
            accessSignJwt(payload);
            return res.status(403).send({
              message: "token not valid",
            });
          } else {
            jwt.verify(
              token,
              process.env.SECRET_JWT!,
              (err: any, user: any) => {
                if (err) {
                  return res.status(401).send({
                    message: "Unauthorized",
                    err,
                  });
                }
                //console.log("ini middleware jwt")
                req.user = user;
                next();
              }
            );
          }
          //next();
        }
        //console.log("ini middleware jwt")
      });
      //next();
    }
  }
  //Promise<Response<any,Record<string,any>> | undefined>
  public async validation(
    req: Request | any,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const errors = validationResult(req);
    // if(req.session.authenticated){
    //res.status(403).json({message:"you've already login"});
    // }else{
    if (!errors.isEmpty()) {
      let error = errors.array().map((err) => {
        return err.msg;
      });
      return res.status(422).json({ error });
    }

    // }
    next();
  }
}

export default new AuthenticationMiddleware();
