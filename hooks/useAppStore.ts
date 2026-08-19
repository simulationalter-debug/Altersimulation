import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, ChatMessage, DecisionScenario, GoalCategory } from "@/types";
import type { Action, ActionImpact } from "@/features/simulations/engine";
import { applyDecisionEvent } from "@/features/simulations/engine";
import { todayKey } from "@/utils/date";
import { buildGoal } from "@/features/goals/goalFactory";
import { generateFutureSelfReply } from "@/services/ai";
import { DECISION_XP, JOURNAL_XP } from "@/data/xp-rules";

interface Actions {
  createFutureSelf: (data: {
    name: string;
    avatarEmoji: string;
    selectedCategories: GoalCategory[];
    targets: Partial<Record<GoalCategory, number>>;
    monthsOut: number;
  }) => void;
  answerDecision: (scenario: DecisionScenario, choiceId: string) => void;
  toggleMission: (missionId: string, categoryImpacts: Partial<Record<GoalCategory, number>>, xp: number, date?: string) => void;
  addJournalEntry: (text: string) => void;
  sendChatMessage: (text: string) => void;
  resetSimulation: () => void;
}

type Store = AppState & Actions;

const initialState: AppState = {
  futureSelf: null,
  goals: [],
  actions: [],
  decisionLog: [],
  journal: [],
  chat: [],
};

function resolveImpacts(
  categoryImpacts: Partial<Record<GoalCategory, number>>,
  goals: AppState["goals"],
): ActionImpact[] {
  const impacts: ActionImpact[] = [];
  for (const [category, delta] of Object.entries(categoryImpacts)) {
    const goal = goals.find((g) => g.category === (category as GoalCategory) && g.status === "active");
    if (!goal || delta === undefined) continue;
    impacts.push({ goalId: goal.goalId, delta, deltaType: "direct" });
  }
  return impacts;
}

/**
 * The whole app's client state, persisted to localStorage. `skipHydration`
 * is required for Next.js SSR: the server has no localStorage, so the
 * store starts empty on both server and first client render (matching
 * markup, no hydration warning), then `<StoreHydration>` calls
 * `useAppStore.persist.rehydrate()` on mount to load the real data.
 *
 * See services/database for the interface this would sit behind once a
 * real backend (Supabase) replaces localStorage as the source of truth.
 */
export const useAppStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      createFutureSelf: ({ name, avatarEmoji, selectedCategories, targets, monthsOut }) => {
        const created = new Date();
        const target = new Date(created);
        target.setMonth(target.getMonth() + monthsOut);
        const createdIso = created.toISOString();
        const targetIso = target.toISOString();
        const weight = 1 / Math.max(1, selectedCategories.length);

        const goals = selectedCategories.map((category) =>
          buildGoal(category, targets[category] ?? 0, createdIso, targetIso, weight),
        );

        set({
          futureSelf: {
            name,
            avatarEmoji,
            selectedCategories,
            createdAt: createdIso,
            targetDate: targetIso,
          },
          goals,
        });
      },

      answerDecision: (scenario, choiceId) => {
        const choice = scenario.choices.find((c) => c.id === choiceId);
        if (!choice) return;
        const date = todayKey();
        const state = get();
        if (state.decisionLog.some((d) => d.date === date)) return; // already answered today

        const impacts = resolveImpacts(choice.categoryImpacts, state.goals);
        const nowIso = new Date().toISOString();
        const event = applyDecisionEvent(state.goals, state.actions, impacts, nowIso);

        const action: Action = {
          actionId: `decision:${date}:${scenario.id}`,
          timestamp: nowIso,
          source: "decision_made",
          impacts,
          xp: DECISION_XP,
        };

        set({
          actions: [...state.actions, action],
          decisionLog: [...state.decisionLog, { date, scenarioId: scenario.id, choiceId, event }],
        });
      },

      toggleMission: (missionId, categoryImpacts, xp, date = todayKey()) => {
        const state = get();
        const actionId = `mission:${date}:${missionId}`;
        const exists = state.actions.some((a) => a.actionId === actionId);
        if (exists) {
          set({ actions: state.actions.filter((a) => a.actionId !== actionId) });
          return;
        }
        const impacts = resolveImpacts(categoryImpacts, state.goals);
        const action: Action = {
          actionId,
          timestamp: new Date().toISOString(),
          source: "mission_completed",
          impacts,
          xp,
        };
        set({ actions: [...state.actions, action] });
      },

      addJournalEntry: (text) => {
        const state = get();
        const entry = { id: `${Date.now()}`, date: todayKey(), text };
        const action: Action = {
          actionId: `journal:${Date.now()}`,
          timestamp: new Date().toISOString(),
          source: "journal_extracted",
          impacts: [],
          xp: JOURNAL_XP,
          rawNote: text,
        };
        set({ journal: [entry, ...state.journal], actions: [...state.actions, action] });
      },

      sendChatMessage: (text) => {
        const state = get();
        const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: "user", text, date: new Date().toISOString() };
        const replyText = generateFutureSelfReply(text, state);
        const replyMsg: ChatMessage = {
          id: `${Date.now()}-f`,
          role: "future-self",
          text: replyText,
          date: new Date().toISOString(),
        };
        set({ chat: [...state.chat, userMsg, replyMsg] });
      },

      resetSimulation: () => set({ ...initialState }),
    }),
    { name: "alter-simulator-store", skipHydration: true },
  ),
);
