import CustomError from "./error";

export const Env = (variableName:string):string =>{
    const value = process.env[variableName];
    if(value === undefined || value === null){
        throw new CustomError("UNDEFINED_ENV",`${variableName} os not defined in the environment`)
    }
    return value;
}