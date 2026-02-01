import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
// import { error } from "node:console";
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // if(res.headersSent){
    //     return next(err);
    // }
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;
    //prisma client validation error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
     
        errorMessage = "You provide incorrect field or missing field";

    }
    //prisma client known request error
     else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if(err.code ==="p2025"){
            statusCode = 404;
            errorMessage = "The requested resource was not found";
        }else if (err.code === "P2002") {
            statusCode = 409;
            errorMessage = "Unique constraint failed";
        }else if(err.code === "P2003"){
            statusCode = 400; 
            errorMessage = "Foreign key constraint failed";
        }
    }
    res.status(statusCode).json({ message: errorMessage, error: errorDetails });
}
export default errorHandler;