import type { Area, AreaId } from "../types";

export const AREAS: Area[] = [
  { id: "love", label: "Love", emoji: "❤️", color: "#f5556c" },
  { id: "money", label: "Money", emoji: "💰", color: "#f7c948" },
  { id: "career", label: "Career", emoji: "💼", color: "#5aa9ff" },
  { id: "lifestyle", label: "Lifestyle", emoji: "🏠", color: "#b98bff" },
  { id: "travel", label: "Travel", emoji: "✈️", color: "#3fd0c9" },
  { id: "confidence", label: "Confidence", emoji: "🧠", color: "#ff9f5a" },
  { id: "fitness", label: "Body / Fitness", emoji: "🏋🏾", color: "#7ee787" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧", color: "#ff7ab6" },
];

export const AREA_MAP: Record<AreaId, Area> = AREAS.reduce(
  (acc, area) => {
    acc[area.id] = area;
    return acc;
  },
  {} as Record<AreaId, Area>,
);
