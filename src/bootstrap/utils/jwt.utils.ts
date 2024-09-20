import jwt from "jsonwebtoken";
import { Env } from "./helper";

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export const accessSignJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, Env("SECRET_JWT"), {
    ...(options && options),
    algorithm: "HS512",
    expiresIn: "1h",
  });
};
export const refreshSignJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, Env("REFRESH_JWT"), {
    ...(options && options),
    algorithm: "HS512",
    expiresIn: "24h",
  });
};
