class CustomError extends Error{
    originalError?: Error | null;
    errors?:string[];
    constructor(errorName:string,errorMessage:string,originalError:Error|null=null){
        super(errorName)
        this.name = errorName;
        this.originalError = originalError;
        this.errors = [];
    }
}
export default CustomError;