import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware is working");
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET in environment variables.");
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log("Verified User:", decoded);

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
