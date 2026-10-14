import type { RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  createEventSchema,
  eventIdSchema,
  eventStatusSchema,
  adminEventQuerySchema,
} from "../validators/event.validator.js";

export const createEvent: RequestHandler = async (req, res) => {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Please check the event details",
      errors: result.error.flatten(),
    });
    return;
  }

  const { startsAt, price, ...data } = result.data;

  const event = await prisma.event.create({
    data: {
      ...data,
      startsAt: new Date(startsAt),
      price: new Prisma.Decimal(price),
    },
  });

  res.status(201).json({
    message: "Event created successfully",
    event,
  });
};

export const listAdminEvents: RequestHandler = async (req, res) => {
  const result = adminEventQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({ message: "Invalid pagination parameters" });
    return;
  }

  const { page, limit } = result.data;

  const [events, total] = await prisma.$transaction(
    [
      prisma.event.findMany({
        orderBy: [{ startsAt: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count(),
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    },
  );

  res.setHeader("Cache-Control", "no-store");

  res.json({
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const updateEventStatus: RequestHandler = async (req, res) => {
  const idResult = eventIdSchema.safeParse(req.params.id);
  const bodyResult = eventStatusSchema.safeParse(req.body);

  if (!idResult.success || !bodyResult.success) {
    res.status(400).json({
      message: "Provide a valid event ID and boolean isActive",
    });
    return;
  }

  try {
    const event = await prisma.event.update({
      where: { id: idResult.data },
      data: {
        isActive: bodyResult.data.isActive,
      },
    });

    res.json({
      message: event.isActive ? "Event activated" : "Event deactivated",
      event,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    throw error;
  }
};
