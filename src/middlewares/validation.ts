import {body,check, validationResult} from "express-validator"
import { Request, Response, NextFunction} from "express"

export const userRegister =
    [
        check("username").notEmpty().withMessage("username required").escape().trim(),
        check("email").isEmail().withMessage("must email").notEmpty().withMessage("email required"),
        check("password").isLength({min:8}).withMessage("length must be 8 letters or more").notEmpty().withMessage("password required")
    ]

export const userLogin = 
    [
        check("email").isEmail().notEmpty().escape().trim(),
        check("password").isLength({min:8}).notEmpty().escape().trim()
    ]

export const editUser =
    [
        check("username").notEmpty().withMessage("username required").escape().trim(),
        check("email").isEmail().withMessage("must email").notEmpty().withMessage("email required"),
    ]

