import jwt from "jsonwebtoken"

export const signJwt = (object:Object, options?:jwt.SignOptions | undefined) => {
    return jwt.sign(object, "secret",{
        ...(options && options),
        algorithm:"HS512",
        expiresIn:60*60*1
    })
}