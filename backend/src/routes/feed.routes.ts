import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getFeed } from "../controllers/feed.controller.js";

const router = Router();

router.get("/", authenticate, getFeed);

export default router;
