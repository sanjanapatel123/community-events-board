import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { signup, login, me, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again later.",
  },
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/me", authenticate, me);
router.post("/logout", logout);

export default router;
