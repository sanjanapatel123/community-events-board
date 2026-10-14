-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MUSIC', 'WORKSHOP', 'FOOD', 'SPORTS', 'KIDS');

-- CreateEnum
CREATE TYPE "CardTheme" AS ENUM ('SUNSET', 'OCEAN', 'FOREST');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "category" "Category" NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "startsAt" TIMESTAMPTZ(3) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavouriteCategory" (
    "userId" UUID NOT NULL,
    "category" "Category" NOT NULL,

    CONSTRAINT "FavouriteCategory_pkey" PRIMARY KEY ("userId","category")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "CardDesign" (
    "userId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "theme" "CardTheme" NOT NULL DEFAULT 'SUNSET',
    "stickers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CardDesign_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Event_isActive_startsAt_id_idx" ON "Event"("isActive", "startsAt", "id");

-- CreateIndex
CREATE INDEX "Event_category_city_isActive_startsAt_idx" ON "Event"("category", "city", "isActive", "startsAt");

-- CreateIndex
CREATE INDEX "Reminder_eventId_idx" ON "Reminder"("eventId");

-- CreateIndex
CREATE INDEX "CardDesign_eventId_idx" ON "CardDesign"("eventId");

-- AddForeignKey
ALTER TABLE "FavouriteCategory" ADD CONSTRAINT "FavouriteCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDesign" ADD CONSTRAINT "CardDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardDesign" ADD CONSTRAINT "CardDesign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Event"
ADD CONSTRAINT "Event_price_nonnegative"
CHECK ("price" >= 0);

ALTER TABLE "CardDesign"
ADD CONSTRAINT "CardDesign_stickers_max_three"
CHECK (cardinality("stickers") <= 3);
