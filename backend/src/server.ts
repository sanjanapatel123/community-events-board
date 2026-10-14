import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT ?? 5000);

async function startServer() {
  await prisma.$connect();

  console.log("PostgreSQL connected");

  app.listen(port, () => {
    console.log(`API running at http://localhost:${port}`);
  });
}

startServer().catch(async (error: unknown) => {
  console.error("Server startup failed:", error);
  await prisma.$disconnect();
  process.exit(1);
});

