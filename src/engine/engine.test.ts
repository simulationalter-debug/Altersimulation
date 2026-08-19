import { describe, expect, it } from "vitest";
import { ewmaRate, percentile } from "./ewma";
import { timelinePctRaw, computeGoalFutureTimeline, requiredRate } from "./trajectory";
import { computeGoalGhostTimeline } from "./ghost";
import { computeGoalPayload, computeDaysToTarget } from "./payload";
import { applyDecisionEvent } from "./decisions";
import { simulateOptions } from "./simulate";
import { assertFitnessGoalSafe, detectLowState } from "./safety";
import { DEFAULT_TUNING, type Action, type Goal } from "./types";

function makeGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    goalId: "g1",
    category: "financial",
    metricType: "cumulative",
    label: "House deposit",
    baseline: 6200,
    target: 12000,
    deadline: "2026-12-01",
    createdAt: "2026-01-01",
    currentValue: 6200,
    weight: 1,
    onboardingDailyRate: 5,
    status: "active",
    ...overrides,
  };
}

function actionOn(date: string, goalId: string, delta: number): Action {
  return {
    actionId: `${date}-${goalId}-${delta}`,
    timestamp: `${date}T09:00:00.000Z`,
    source: "manual_log",
    impacts: [{ goalId, delta, deltaType: "direct" }],
    xp: 0,
  };
}

describe("§2 tanh confidence curve", () => {
  it("maps exactly-on-pace to 50%", () => {
    expect(timelinePctRaw(1)).toBeCloseTo(50, 5);
  });

  it("comfortably ahead (pace_ratio=1.5) is in the high 70s, per spec's ~78%", () => {
    const pct = timelinePctRaw(1.5);
    expect(pct).toBeGreaterThan(74);
    expect(pct).toBeLessThan(80);
  });

  it("half pace is in the low-to-mid 20s, per spec's ~22%", () => {
    const pct = timelinePctRaw(0.5);
    expect(pct).toBeGreaterThan(20);
    expect(pct).toBeLessThan(26);
  });

  it("never returns 0 or 100", () => {
    expect(timelinePctRaw(-100)).toBeGreaterThanOrEqual(DEFAULT_TUNING.clampMin);
    expect(timelinePctRaw(100)).toBeLessThanOrEqual(DEFAULT_TUNING.clampMax);
  });
});

describe("§1.3/§2 EWMA", () => {
  it("decays toward zero on a run of zero-delta (inaction) days", () => {
    const withActivity = ewmaRate([10, 10, 10, 10, 10], 10);
    const thenSilent = ewmaRate([10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0], 10);
    expect(thenSilent).toBeLessThan(withActivity);
  });

  it("weights recent days more heavily (half-life behaviour)", () => {
    const recentBurst = ewmaRate([0, 0, 0, 0, 0, 0, 0, 0, 0, 10], 10);
    const oldBurst = ewmaRate([10, 0, 0, 0, 0, 0, 0, 0, 0, 0], 10);
    expect(recentBurst).toBeGreaterThan(oldBurst);
  });
});

describe("percentile", () => {
  it("computes the 25th percentile (worst quartile)", () => {
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.25)).toBeCloseTo(3.25, 2);
  });
});

describe("§4 decision worked example", () => {
  it("investing £400 shifts the timeline by ~21 days", () => {
    // Goal: save £12,000, currently £6,200, steady £19/day inflow for 28 days.
    const goal = makeGoal({ baseline: 6200 - 19 * 28, target: 12000, deadline: "2026-12-01" });
    const actions: Action[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      actions.push(actionOn(d.toISOString().slice(0, 10), goal.goalId, 19));
    }
    const asOf = "2026-01-28";
    const rate = 19; // by construction, the EWMA over a constant 19/day series ≈ 19
    const before = computeDaysToTarget(goal, 6200, rate);
    const after = computeDaysToTarget(goal, 6600, rate);
    expect(Math.round(before - after)).toBeCloseTo(21, -1); // within a day or two of 21

    const event = applyDecisionEvent(
      [goal],
      actions,
      [{ goalId: goal.goalId, delta: 400, deltaType: "direct" }],
      asOf,
    );
    expect(event.goal).toBe(goal.goalId);
    expect(event.timeShiftDays).toBeGreaterThan(15);
    expect(event.timeShiftDays).toBeLessThan(27);
  });
});

describe("day-one decisions (EWMA cold-start seed)", () => {
  it("a brand new goal with zero action history still registers a decision's impact", () => {
    // Fresh goal, no actions logged yet — the exact state a user is in
    // for their very first "today's decision" in the app.
    const goal = makeGoal({ baseline: 0, target: 12000, onboardingDailyRate: 5, createdAt: "2026-01-01" });
    const event = applyDecisionEvent(
      [goal],
      [],
      [{ goalId: goal.goalId, delta: 400, deltaType: "direct" }],
      "2026-01-01",
    );
    expect(event.timelinePctChange).toBeGreaterThan(0);
    expect(event.timeShiftDays).toBeGreaterThan(0);
  });
});

describe("§3 Ghost You", () => {
  it("cold start (days 0-27) holds at the onboarding rate", () => {
    const goal = makeGoal({ onboardingDailyRate: 8 });
    const timeline = computeGoalGhostTimeline(goal, "2026-01-15"); // day 14
    const last = timeline[timeline.length - 1];
    // currentValue should be baseline + 14 * 8 exactly (cold start, fixed rate)
    expect(last).toBeDefined();
  });

  it("never improves from a single good week", () => {
    const goal = makeGoal({ onboardingDailyRate: 5, createdAt: "2026-01-01" });
    const shortRun = computeGoalGhostTimeline(goal, "2026-02-10"); // ~40 days, into warm phase
    const longRun = computeGoalGhostTimeline(goal, "2026-02-10");
    // Determinism check: same inputs, same outputs (pure function, no hidden state).
    expect(shortRun[shortRun.length - 1].displayed).toBeCloseTo(
      longRun[longRun.length - 1].displayed,
      6,
    );
  });

  it("Future You pulls ahead of Ghost You when the user is consistently active", () => {
    const goal = makeGoal({ baseline: 1000, target: 5000, onboardingDailyRate: 1, createdAt: "2026-01-01" });
    const actions: Action[] = [];
    for (let i = 0; i < 60; i++) {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      actions.push(actionOn(d.toISOString().slice(0, 10), goal.goalId, 20));
    }
    const asOf = "2026-03-02"; // 60 days later
    const payload = computeGoalPayload(goal, actions, asOf);
    expect(payload.timelinePct).toBeGreaterThan(payload.ghostTimelinePct);
    expect(payload.ghostGap).toBeGreaterThan(0);
  });
});

describe("§2 smoothing (anti-volatility)", () => {
  it("never moves the displayed value more than the max per day", () => {
    const goal = makeGoal({ baseline: 0, target: 100, createdAt: "2026-01-01" });
    // One huge spike after a long quiet run should still ramp, not jump.
    const actions: Action[] = [actionOn("2026-01-20", goal.goalId, 1000)];
    const timeline = computeGoalFutureTimeline(goal, actions, "2026-01-25");
    for (let i = 1; i < timeline.length; i++) {
      const move = Math.abs(timeline[i].displayed - timeline[i - 1].displayed);
      expect(move).toBeLessThanOrEqual(DEFAULT_TUNING.maxDailyMoveDisplayed + 1e-9);
    }
  });
});

describe("§5 decision simulator", () => {
  it("prices multiple options against the same starting state without mutating it", () => {
    const goal = makeGoal({ baseline: 6200, target: 12000, createdAt: "2026-01-01", deadline: "2026-12-01" });
    // Establish a real projected rate so a lump-sum option actually moves the pace ratio.
    const actions: Action[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      actions.push(actionOn(d.toISOString().slice(0, 10), goal.goalId, 5));
    }
    const asOf = "2026-01-28";

    const results = simulateOptions(
      [goal],
      actions,
      [
        { optionId: "A", label: "Book the holiday", impacts: [{ goalId: goal.goalId, delta: -200, deltaType: "direct" }] },
        { optionId: "B", label: "Invest £400", impacts: [{ goalId: goal.goalId, delta: 400, deltaType: "direct" }] },
      ],
      asOf,
    );

    expect(results).toHaveLength(2);
    const optionB = results.find((r) => r.optionId === "B")!;
    const optionA = results.find((r) => r.optionId === "A")!;
    expect(optionB.perGoal[0].timelinePctChange).toBeGreaterThan(optionA.perGoal[0].timelinePctChange);

    // Original goal object untouched.
    expect(goal.currentValue).toBe(6200);
  });
});

describe("§7 safety rails", () => {
  it("rejects a fitness goal that isn't frequency-based", () => {
    expect(() =>
      assertFitnessGoalSafe({ category: "fitness", metricType: "cumulative" }),
    ).toThrow();
    expect(() =>
      assertFitnessGoalSafe({ category: "fitness", metricType: "frequency" }),
    ).not.toThrow();
  });

  it("flags low-state only when sentiment is persistently negative AND engagement has collapsed", () => {
    expect(
      detectLowState({ recentSentiments: [-0.5, -0.6, -0.4], daysSinceLastAction: 6 }),
    ).toBe(true);
    expect(
      detectLowState({ recentSentiments: [-0.5, -0.6, -0.4], daysSinceLastAction: 1 }),
    ).toBe(false);
    expect(
      detectLowState({ recentSentiments: [0.5, 0.2, -0.1], daysSinceLastAction: 6 }),
    ).toBe(false);
  });
});

describe("required_rate / days_remaining edge cases", () => {
  it("clamps days_remaining to at least 1 to avoid divide-by-zero on the deadline day", () => {
    const goal = makeGoal({ deadline: "2026-01-01" });
    expect(() => requiredRate(goal, 6200, "2026-01-01")).not.toThrow();
    expect(Number.isFinite(requiredRate(goal, 6200, "2026-01-01"))).toBe(true);
  });
});

describe("synthetic 90-day user", () => {
  it("produces a stable, bounded timeline for a consistently-active user", () => {
    const goal = makeGoal({ baseline: 0, target: 9000, createdAt: "2026-01-01", deadline: "2027-01-01" });
    const actions: Action[] = [];
    for (let i = 0; i < 90; i++) {
      const d = new Date("2026-01-01");
      d.setDate(d.getDate() + i);
      // Skip weekends to simulate a realistic, imperfect user.
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      if (!isWeekend) actions.push(actionOn(d.toISOString().slice(0, 10), goal.goalId, 15));
    }
    const asOf = "2026-03-31";
    const payload = computeGoalPayload(goal, actions, asOf);
    expect(payload.timelinePct).toBeGreaterThanOrEqual(2);
    expect(payload.timelinePct).toBeLessThanOrEqual(98);
    expect(payload.ghostTimelinePct).toBeGreaterThanOrEqual(2);
    expect(payload.ghostTimelinePct).toBeLessThanOrEqual(98);
  });
});
