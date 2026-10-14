import "dotenv/config";
import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminEventRoutes from "./routes/admin-event.routes.js";

const app = express();

const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Reject browser mutations from an unexpected origin.
// Requests without Origin must use JSON, which browsers
// cannot send cross-origin without a successful preflight.
app.use((req, res, next) => {
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (isMutation) {
    const origin = req.get("origin");

    if (origin && origin !== frontendUrl) {
      res.status(403).json({ message: "Origin not allowed" });
      return;
    }

    if (!req.is("application/json")) {
      res.status(415).json({
        message: "Content-Type must be application/json",
      });
      return;
    }
  }

  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Community Events API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin/events", adminEventRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  console.error(error);

  res.status(500).json({
    message: "Something went wrong. Please try again.",
  });
};

app.use(errorHandler);

export default app;
