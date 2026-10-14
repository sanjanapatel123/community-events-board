export const categories = [
  "MUSIC",
  "WORKSHOP",
  "FOOD",
  "SPORTS",
  "KIDS",
] as const;

export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  MUSIC: "Music",
  WORKSHOP: "Workshops",
  FOOD: "Food",
  SPORTS: "Sports",
  KIDS: "Kids",
};

export type CommunityEvent = {
  id: string;
  title: string;
  category: Category;
  city: string;
  startsAt: string;
  price: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
};

export type EventFilters = {
  category: Category | "";
  city: string;
  search: string;
  page: number;
  limit: number;
};

export type EventsResponse = {
  events: CommunityEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};
