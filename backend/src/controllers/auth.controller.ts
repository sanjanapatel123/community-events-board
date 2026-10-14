import type { CookieOptions, RequestHandler } from "express";
import * as argon2 from "argon2";
import { z } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { createAccessToken } from "../lib/jwt.js";

const credentialsSchema = z
  .object({
    email: z.string().trim().email().max(254).toLowerCase(),
    password: z.string().min(8).max(128),
  })
  .strict();

const publicUserSelect = {
  id: true,
  email: true,
  role: true,
} as const;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const signup: RequestHandler = async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Enter a valid email and a password of 8–128 characters",
    });
    return;
  }

  const { email, password } = result.data;

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "USER",
      },
      select: publicUserSelect,
    });

    res.status(201).json({
      message: "Account created. Please log in.",
      user,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    throw error;
  }
};

export const login: RequestHandler = async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: "Invalid email or password format" });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  const validPassword = user
    ? await argon2.verify(user.passwordHash, password)
    : false;

  if (!user || !validPassword) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const accessToken = createAccessToken(user.id);

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000,
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    accessToken,
    tokenType: "Bearer",
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

export const me: RequestHandler = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ user: req.user });
};

export const logout: RequestHandler = (_req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.json({ message: "Logged out successfully" });
};
