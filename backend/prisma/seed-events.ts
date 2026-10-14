import type { Category } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.js";

type SampleEvent = {
  title: string;
  category: Category;
  city: string;
  daysFromToday: number;
  price: string;
  description: string;
  isActive: boolean;
};

const samples: SampleEvent[] = [
  {
    title: "Coimbatore Music Night",
    category: "MUSIC",
    city: "Coimbatore",
    daysFromToday: 2,
    price: "499.00",
    description: "An evening of live music featuring local bands and singers.",
    isActive: true,
  },
  {
    title: "Chennai Acoustic Evening",
    category: "MUSIC",
    city: "Chennai",
    daysFromToday: 5,
    price: "299.00",
    description: "Enjoy acoustic performances in a relaxed community setting.",
    isActive: true,
  },
  {
    title: "Bengaluru Jazz Night",
    category: "MUSIC",
    city: "Bengaluru",
    daysFromToday: -3,
    price: "799.00",
    description: "A community jazz night featuring instrumental performances.",
    isActive: true,
  },
  {
    title: "Pottery for Beginners",
    category: "WORKSHOP",
    city: "Coimbatore",
    daysFromToday: 3,
    price: "899.00",
    description:
      "Learn basic pottery techniques and create your first clay bowl.",
    isActive: true,
  },
  {
    title: "Weekend Photography Workshop",
    category: "WORKSHOP",
    city: "Chennai",
    daysFromToday: 7,
    price: "1200.00",
    description:
      "Practise composition, lighting and street photography together.",
    isActive: true,
  },
  {
    title: "Community Painting Workshop",
    category: "WORKSHOP",
    city: "Bengaluru",
    daysFromToday: 10,
    price: "650.00",
    description:
      "Explore colours and paint a landscape with guided instruction.",
    isActive: false,
  },
  {
    title: "Coimbatore Street Food Festival",
    category: "FOOD",
    city: "Coimbatore",
    daysFromToday: 4,
    price: "199.00",
    description: "Discover regional snacks, street food and homemade desserts.",
    isActive: true,
  },
  {
    title: "Chennai Night Food Market",
    category: "FOOD",
    city: "Chennai",
    daysFromToday: 6,
    price: "0.00",
    description: "Browse local food stalls at an open-air evening market.",
    isActive: true,
  },
  {
    title: "Bengaluru Farmers Food Fair",
    category: "FOOD",
    city: "Bengaluru",
    daysFromToday: -5,
    price: "100.00",
    description: "Meet local producers and discover fresh seasonal food.",
    isActive: true,
  },
  {
    title: "Community Badminton Meetup",
    category: "SPORTS",
    city: "Coimbatore",
    daysFromToday: 1,
    price: "150.00",
    description:
      "Join friendly badminton matches suitable for all skill levels.",
    isActive: true,
  },
  {
    title: "Chennai Community Run",
    category: "SPORTS",
    city: "Chennai",
    daysFromToday: 8,
    price: "0.00",
    description: "A relaxed community run with a guided warm-up and cooldown.",
    isActive: true,
  },
  {
    title: "Bengaluru Football Evening",
    category: "SPORTS",
    city: "Bengaluru",
    daysFromToday: 9,
    price: "250.00",
    description: "Play friendly five-a-side football with neighbourhood teams.",
    isActive: false,
  },
  {
    title: "Kids Storytelling Circle",
    category: "KIDS",
    city: "Coimbatore",
    daysFromToday: 3,
    price: "100.00",
    description:
      "An interactive storytelling session with games and characters.",
    isActive: true,
  },
  {
    title: "Junior Science Explorers",
    category: "KIDS",
    city: "Bengaluru",
    daysFromToday: 12,
    price: "350.00",
    description: "Explore simple science experiments with guided activities.",
    isActive: true,
  },
  {
    title: "Chennai Kids Craft Day",
    category: "KIDS",
    city: "Chennai",
    daysFromToday: -2,
    price: "200.00",
    description: "Create colourful paper crafts and handmade decorations.",
    isActive: false,
  },
];

const images: Record<Category, string> = {
  MUSIC: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  WORKSHOP: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
  FOOD: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
  SPORTS: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
  KIDS: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9",
};

// Find today's calendar date in India, independent of machine timezone.
function getIndiaDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)!.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
  };
}

export async function seedEvents() {
  const today = getIndiaDate();

  const events = samples.map((sample, index) => ({
    // Stable IDs prevent duplicates when the seed runs again.
    id: `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    title: sample.title,
    category: sample.category,
    city: sample.city,

    // 13:00 UTC = 6:30 PM IST. Date.UTC handles month/year rollover.
    startsAt: new Date(
      Date.UTC(
        today.year,
        today.month - 1,
        today.day + sample.daysFromToday,
        13,
        0,
        0,
      ),
    ),

    price: sample.price,
    description: sample.description,
    imageUrl: `${images[sample.category]}?auto=format&fit=crop&w=1000&q=80`,
    isActive: sample.isActive,
  }));

  const result = await prisma.event.createMany({
    data: events,
    skipDuplicates: true,
  });

  console.log(`Sample events inserted: ${result.count}`);
}
