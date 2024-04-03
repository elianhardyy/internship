import jwt from "jsonwebtoken"

export interface TokenData {
    accessToken:string,
    refreshToken:string
}

export const accessSignJwt = (object:Object, options?:jwt.SignOptions | undefined) => {
    return jwt.sign(object, process.env.SECRET_JWT!,{
        ...(options && options),
        algorithm:"HS512",
        expiresIn:86400000
    })
}
export const refreshSignJwt = (object:Object, options?:jwt.SignOptions | undefined) => {
    return jwt.sign(object, process.env.REFRESH_JWT!,{
        ...(options && options),
        algorithm:"HS512",
        expiresIn:86400000
    })
}