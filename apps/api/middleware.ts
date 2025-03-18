import type { NextFunction, Request, Response } from "express";

export const authMiddleware=async(req:Request,res:Response,next:NextFunction)=>{
    console.log("Middleware is working");
    req.userId="1"
    next();
}