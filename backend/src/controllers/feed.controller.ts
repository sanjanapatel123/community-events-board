import type { RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { feedQuerySchema } from "../validators/preference.validator.js";

export const getFeed: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const result = feedQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid pagination parameters",
    });
    return;
  }

  const userId = req.user.id;
  const { page, limit } = result.data;
  const now = new Date();

  const { categories, events, total } = await prisma.$transaction(
    async (tx) => {
      const favourites = await tx.favouriteCategory.findMany({
        where: { userId },
        orderBy: { category: "asc" },
        select: { category: true },
      });

      const categories = favourites.map((item) => item.category);

      const where: Prisma.EventWhereInput = {
        isActive: true,
        startsAt: { gt: now },
        category: { in: categories },
      };

      const events = await tx.event.findMany({
        where,
        orderBy: [{ startsAt: "asc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await tx.event.count({ where });

      return { categories, events, total };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
    },
  );

  const totalPages = Math.ceil(total / limit);

  const message =
    categories.length === 0
      ? "Choose your favourite categories to personalise your feed."
      : total === 0
        ? "No upcoming events in your favourite categories yet."
        : events.length === 0
          ? "No events on this page."
          : "Your personalised feed";

  res.setHeader("Cache-Control", "no-store");

  res.json({
    message,
    categories,
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
