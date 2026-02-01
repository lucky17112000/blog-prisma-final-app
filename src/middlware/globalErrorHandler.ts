import { NextFunction, Request, Response } from "express";
// import { error } from "node:console";
function errorHandler(err:any , req:Request , res:Response , next:NextFunction){
    // if(res.headersSent){
    //     return next(err);
    // }
    res.status(500).json({message : 'Something went wrong!' , error : err.message});
    res.json({message : 'Something went wrong!' , error : err.message});
}
export default errorHandler;