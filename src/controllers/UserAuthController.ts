import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("Missing environment variables");

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const userAuthController = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Check token
  const token = req.headers.authorization || "";

  if (token) {
    try {
      // Verify token
      const decodedToken = jwt.verify(token, jwtSecret) as { _id: string };

      // Add user ID to request
      req.userId = decodedToken._id;
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Call next middleware
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
