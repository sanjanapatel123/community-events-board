export const themes = {
  SUNSET: {
    label: "Sunset",
    background: "#f8dce8",
    foreground: "#57243e",
  },
  OCEAN: {
    label: "Ocean",
    background: "#dceefa",
    foreground: "#173f59",
  },
  FOREST: {
    label: "Forest",
    background: "#e0efdf",
    foreground: "#24462d",
  },
} as const;

export const stickers = {
  music: { emoji: "🎵", label: "Music" },
  star: { emoji: "⭐", label: "Star" },
  party: { emoji: "🎉", label: "Party" },
  pizza: { emoji: "🍕", label: "Pizza" },
  heart: { emoji: "❤️", label: "Heart" },
} as const;

export type CardTheme = keyof typeof themes;
export type StickerId = keyof typeof stickers;

export type CardDesign = {
  theme: CardTheme;
  stickers: StickerId[];
};

export type CardDesignResponse = {
  eventId: string;
  design: CardDesign;
};
