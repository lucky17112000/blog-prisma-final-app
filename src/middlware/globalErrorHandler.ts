import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
// import { error } from "node:console";
function errorHandler(err:any , req:Request , res:Response , next:NextFunction){
    // if(res.headersSent){
    //     return next(err);
    // }
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;
    //prisma client validation error
    if(err instanceof Prisma.PrismaClientValidationError){
        statusCode =400;
        errorMessage = "You provide incorrect field or missing field";
        
    }
    res.status(statusCode).json({message : errorMessage , error : errorDetails});
}
export default errorHandler;