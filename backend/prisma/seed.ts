import "dotenv/config";
import * as argon2 from "argon2";
import { prisma } from "../src/lib/prisma.js";
import { seedEvents } from "./seed-events.js";

async function seedAdmin() {
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

  await prisma.user.create({
    data: {
      email,
      passwordHash: await argon2.hash(password, {
        type: argon2.argon2id,
      }),
      role: "ADMIN",
    },
  });

  console.log(`Admin created: ${email}`);
}

async function main() {
  await seedAdmin();
  await seedEvents();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
