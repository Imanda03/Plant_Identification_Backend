import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createError from "http-errors";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware to verify token and check user role
export const verifyToken = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return next(createError(401, "You are not authenticated"));
      }

      jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return next(createError(403, "Token is not valid"));

        req.user = decoded;
        if (roles.length > 0) {
          if (!roles.includes(req.user.role)) {
            return next(createError(403, "You do not have the required role"));
          }
        }

        next();
      });
    } catch (error) {
      return next(createError(500, "Internal server error"));
    }
  };
};
