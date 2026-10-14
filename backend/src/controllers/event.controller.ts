import type { RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import {
  publicEventQuerySchema,
  eventIdSchema,
} from "../validators/event.validator.js";

export const listEvents: RequestHandler = async (req, res) => {
  const result = publicEventQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid filters or pagination",
      errors: result.error.flatten(),
    });
    return;
  }

  const { category, city, search, page, limit } = result.data;

  const where: Prisma.EventWhereInput = {
    isActive: true,
    startsAt: {
      gt: new Date(),
    },
  };

  if (category) {
    where.category = category;
  }

  if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }

  if (search) {
    // Escape PostgreSQL LIKE wildcards so search is literal text.
    const literalSearch = search.replace(/[\\%_]/g, "\\$&");

    where.OR = [
      {
        title: {
          contains: literalSearch,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: literalSearch,
          mode: "insensitive",
        },
      },
    ];
  }

  const [events, total] = await prisma.$transaction(
    [
      prisma.event.findMany({
        where,
        orderBy: [{ startsAt: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ],
    {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    },
  );

  const totalPages = Math.ceil(total / limit);

  res.setHeader("Cache-Control", "no-store");

  res.json({
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    },
  });
};

export const getEvent: RequestHandler = async (req, res) => {
  const result = eventIdSchema.safeParse(req.params.id);

  if (!result.success) {
    res.status(400).json({ message: "Invalid event ID" });
    return;
  }

  const event = await prisma.event.findFirst({
    where: {
      id: result.data,
      isActive: true,
      startsAt: {
        gt: new Date(),
      },
    },
  });

  if (!event) {
    res.status(404).json({
      message: "Event not found or no longer available",
    });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.json({ event });
};
