import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { eventIdSchema } from "../validators/event.validator.js";

export const getReminders: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const reminders = await prisma.reminder.findMany({
    where: { userId: req.user.id },
    select: { eventId: true },
    orderBy: { createdAt: "desc" },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    eventIds: reminders.map((reminder) => reminder.eventId),
  });
};

export const saveReminder: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const result = eventIdSchema.safeParse(req.params.eventId);

  if (!result.success) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  const eventId = result.data;
  const userId = req.user.id;

  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isActive: true,
      startsAt: { gt: new Date() },
    },
    select: { id: true },
  });

  if (!event) {
    res.status(404).json({
      message: "Event not found or no longer available",
    });
    return;
  }

  // Repeated requests must not create duplicate reminders.
  await prisma.reminder.createMany({
    data: [{ userId, eventId }],
    skipDuplicates: true,
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    message: "Reminder saved",
    eventId,
    reminded: true,
  });
};

export const removeReminder: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const result = eventIdSchema.safeParse(req.params.eventId);

  if (!result.success) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  const eventId = result.data;

  // Also succeeds if the reminder has already been removed.
  await prisma.reminder.deleteMany({
    where: {
      userId: req.user.id,
      eventId,
    },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    message: "Reminder removed",
    eventId,
    reminded: false,
  });
};
