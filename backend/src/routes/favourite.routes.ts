import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getFavourites,
  saveFavourites,
} from "../controllers/favourite.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getFavourites);
router.put("/", saveFavourites);

export default router;
