import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getReminders,
  saveReminder,
  removeReminder,
} from "../controllers/reminder.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getReminders);
router.put("/:eventId", saveReminder);
router.delete("/:eventId", removeReminder);

export default router;
