import express, { NextFunction, Request, Response, Router } from 'express';
import { auth as betterAuth } from "../lib/auth";
export enum userRole {
    USER = "USER",
    ADMIN = "ADMIN"

}
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                email: string,
                name: string,
                role: userRole
                emailVerified: boolean
            }
        }
    }
}
const auth = (...roles: userRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.headers);
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
                
                //seesion er modde user thakbe tai session ta nia asbo jeta better auth create kore rakse
            })
            if (!session) {
                return res.status(401).json({ success: false, message: "Unauthorized" })
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({ success: false, message: "Please verify your email to access this resource" })
            }
            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: session.user.role as userRole,
                emailVerified: session.user.emailVerified
            }
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: "Forbidden" })
            }

            //  console.log("auth middleware" , session);
            next();
        } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
}

export { auth }