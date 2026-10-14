import "dotenv/config";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const jwtSecret: string = secret;

const issuer = "community-events-api";
const audience = "community-events";

export function createAccessToken(userId: string) {
  return jwt.sign({}, jwtSecret, {
    algorithm: "HS256",
    subject: userId,
    issuer,
    audience,
    expiresIn: "1h",
  });
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, jwtSecret, {
    algorithms: ["HS256"],
    issuer,
    audience,
  });

  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Invalid token payload");
  }

  return payload.sub;
}
