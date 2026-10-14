import "dotenv/config";
import * as argon2 from "argon2";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (8+ characters)");
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    if (existing.role !== "ADMIN") {
      throw new Error("Admin email already belongs to a regular user");
    }

    console.log("Admin already exists");
    return;
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin created: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
