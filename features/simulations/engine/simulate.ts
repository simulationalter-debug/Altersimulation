import type { Action, ActionImpact, Goal, SimulationOptionResult, TuningConstants } from "./types";
import { DEFAULT_TUNING } from "./types";
import { computePerGoalShifts } from "./decisions";

export interface SimulationOption {
  optionId: string;
  label: string;
  impacts: ActionImpact[];
}

/**
 * §5 Decision Simulator: "clone current state → apply hypothetical deltas
 * per option → recompute all timeline_pcts and time_shifts → discard
 * clone." Nothing here mutates `goals` or `actions` — each option is
 * priced independently against the same starting state, and nothing
 * persists unless the caller separately converts a chosen option into a
 * real decision via `applyDecisionEvent`.
 */
export function simulateOptions(
  goals: Goal[],
  actions: Action[],
  options: SimulationOption[],
  asOfIso: string,
  tuning: TuningConstants = DEFAULT_TUNING,
): SimulationOptionResult[] {
  return options.map((option) => {
    const shifts = computePerGoalShifts(goals, actions, option.impacts, asOfIso, tuning);
    return {
      optionId: option.optionId,
      label: option.label,
      perGoal: shifts.map((s) => ({
        goalId: s.goalId,
        timelinePctBefore: s.timelinePctBefore,
        timelinePctAfter: s.timelinePctAfter,
        timelinePctChange: s.timelinePctChange,
        daysToTargetBefore: s.daysToTargetBefore,
        daysToTargetAfter: s.daysToTargetAfter,
        timeShiftDays: s.timeShiftDays,
      })),
    };
  });
}
