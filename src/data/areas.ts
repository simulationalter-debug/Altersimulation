import type { GoalCategory } from "../engine";

export interface Area {
  id: GoalCategory;
  label: string;
  emoji: string;
  color: string;
}

export const AREAS: Area[] = [
  { id: "relationship", label: "Love", emoji: "❤️", color: "#ff5b94" },
  { id: "financial", label: "Money", emoji: "💰", color: "#f7c948" },
  { id: "career", label: "Career", emoji: "💼", color: "#5aa9ff" },
  { id: "lifestyle", label: "Lifestyle", emoji: "🏠", color: "#b98bff" },
  { id: "travel", label: "Travel", emoji: "✈️", color: "#3fd0c9" },
  { id: "confidence", label: "Confidence", emoji: "🧠", color: "#ff9f5a" },
  { id: "fitness", label: "Body / Fitness", emoji: "🏋🏾", color: "#7ee787" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧", color: "#ff7ab6" },
];

export const AREA_MAP: Record<GoalCategory, Area> = AREAS.reduce(
  (acc, area) => {
    acc[area.id] = area;
    return acc;
  },
  {} as Record<GoalCategory, Area>,
);
