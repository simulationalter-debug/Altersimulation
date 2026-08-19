import type { Goal, GoalCategory } from "@/features/simulations/engine";
import { GOAL_TEMPLATES } from "@/data/life-categories/goalTemplates";

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
}

export function buildGoal(
  category: GoalCategory,
  targetInput: number,
  createdAtIso: string,
  deadlineIso: string,
  weight: number,
): Goal {
  const template = GOAL_TEMPLATES[category];
  const totalDays = Math.max(
    1,
    Math.round((new Date(deadlineIso).getTime() - new Date(createdAtIso).getTime()) / 86_400_000),
  );
  const totalWeeks = totalDays / 7;

  const target = template.perWeekTarget ? targetInput * totalWeeks : targetInput;
  const baseline = 0;
  const requiredDailyRate = (target - baseline) / totalDays;
  const onboardingDailyRate = requiredDailyRate * template.ghostPassiveFactor;

  return {
    goalId: nextId("goal"),
    category,
    metricType: template.metricType,
    label: template.buildLabel(targetInput),
    baseline,
    target,
    deadline: deadlineIso,
    createdAt: createdAtIso,
    currentValue: baseline,
    weight,
    onboardingDailyRate,
    status: "active",
  };
}
