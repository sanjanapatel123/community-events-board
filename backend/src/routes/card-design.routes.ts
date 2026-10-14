import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getCardDesign,
  saveCardDesign,
} from "../controllers/card-design.controller.js";

const router = Router();

router.use(authenticate);

router.get("/:eventId", getCardDesign);
router.put("/:eventId", saveCardDesign);

export default router;
