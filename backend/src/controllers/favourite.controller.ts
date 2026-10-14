import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma.js";
import { favouritesSchema } from "../validators/preference.validator.js";

export const getFavourites: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const favourites = await prisma.favouriteCategory.findMany({
    where: { userId: req.user.id },
    orderBy: { category: "asc" },
    select: { category: true },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    categories: favourites.map((item) => item.category),
  });
};

export const saveFavourites: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Please log in" });
    return;
  }

  const result = favouritesSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Please select valid, unique categories",
      errors: result.error.flatten(),
    });
    return;
  }

  const { categories } = result.data;

  // Nested writes run atomically: all changes succeed or none do.
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      favourites: {
        deleteMany: {},
        create: categories.map((category) => ({ category })),
      },
    },
    select: {
      favourites: {
        orderBy: { category: "asc" },
        select: { category: true },
      },
    },
  });

  res.setHeader("Cache-Control", "no-store");

  res.json({
    message: "Favourite categories saved",
    categories: user.favourites.map((item) => item.category),
  });
};
