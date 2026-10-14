import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { eventIdSchema } from "../validators/event.validator.js";
import { cardDesignSchema } from "../validators/card-design.validator.js";

export const getCardDesign: RequestHandler = async (req, res) => {
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

  const design = await prisma.cardDesign.findUnique({
    where: {
      userId_eventId: {
        userId: req.user.id,
        eventId,
      },
    },
    select: {
      theme: true,
      stickers: true,
    },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    eventId,
    design: design ?? {
      theme: "SUNSET",
      stickers: [],
    },
  });
};

export const saveCardDesign: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const idResult = eventIdSchema.safeParse(req.params.eventId);
  const bodyResult = cardDesignSchema.safeParse(req.body);

  if (!idResult.success) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  if (!bodyResult.success) {
    res.status(400).json({
      message: "Choose a valid theme and up to 3 allowed stickers",
      errors: bodyResult.error.flatten(),
    });
    return;
  }

  const eventId = idResult.data;
  const userId = req.user.id;
  const { theme, stickers } = bodyResult.data;

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

  const design = await prisma.cardDesign.upsert({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
    create: {
      userId,
      eventId,
      theme,
      stickers,
    },
    update: {
      theme,
      stickers,
    },
    select: {
      theme: true,
      stickers: true,
    },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    message: "Card design saved",
    eventId,
    design,
  });
};
