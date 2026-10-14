import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  listAdminEvents,
  updateEventStatus,
} from "../controllers/admin-event.controller.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/", listAdminEvents);
router.post("/", createEvent);
router.patch("/:id/status", updateEventStatus);

export default router;
