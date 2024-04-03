import {body,check, validationResult} from "express-validator"
export const userRegister =
    [
        check("username").notEmpty().withMessage("username required").escape().trim(),
        check("email").isEmail().withMessage("email contain").notEmpty().withMessage("email required").escape().trim(),
        check("password").isLength({min:8}).withMessage("password length must be 8 letters or more").notEmpty().withMessage("password required")
    ]

export const userLogin = 
    [
        check("email").isEmail().withMessage("email contain").notEmpty().withMessage("email is required").escape().trim(),
        check("password").isLength({min:8}).withMessage("password 8 characters").notEmpty().withMessage("password is required").escape().trim()
    ]

export const editUser =
    [
        check("username").notEmpty().withMessage("username required").escape().trim(),
        check("email").isEmail().withMessage("must email").notEmpty().withMessage("email required"),
    ]

