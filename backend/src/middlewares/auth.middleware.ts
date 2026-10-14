import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../lib/jwt.js";

export type AuthUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate: RequestHandler = async (req, res, next) => {
  const authorization = req.get("authorization");

  const token = authorization
    ? authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : undefined
    : req.cookies?.accessToken;

  if (typeof token !== "string" || !token) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  let userId: string;

  try {
    userId = verifyAccessToken(token);
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    res.status(401).json({ message: "Please log in again" });
    return;
  }

  req.user = user;
  next();
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
};
