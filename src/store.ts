import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppState,
  AreaId,
  ChatMessage,
  DecisionScenario,
  FutureSelf,
} from "./types";
import { todayKey } from "./lib/date";
import { generateFutureSelfReply } from "./lib/futureSelfChat";

interface Actions {
  goToOnboarding: () => void;
  goToLanding: () => void;
  createFutureSelf: (data: {
    name: string;
    avatarEmoji: string;
    selectedAreas: AreaId[];
    goals: Partial<Record<AreaId, string>>;
    monthsOut: number;
  }) => void;
  answerDecision: (scenario: DecisionScenario, choiceId: string) => void;
  toggleMission: (missionId: string, date?: string) => void;
  addJournalEntry: (text: string) => void;
  sendChatMessage: (text: string) => void;
  resetSimulation: () => void;
}

type Store = AppState & Actions;

const initialState: AppState = {
  screen: "landing",
  futureSelf: null,
  decisions: [],
  completedMissions: [],
  journal: [],
  chat: [],
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,

      goToOnboarding: () => set({ screen: "onboarding" }),
      goToLanding: () => set({ screen: "landing" }),

      createFutureSelf: ({ name, avatarEmoji, selectedAreas, goals, monthsOut }) => {
        const created = new Date();
        const target = new Date(created);
        target.setMonth(target.getMonth() + monthsOut);
        const futureSelf: FutureSelf = {
          name,
          avatarEmoji,
          selectedAreas,
          goals,
          createdAt: created.toISOString(),
          targetDate: target.toISOString(),
        };
        set({ futureSelf, screen: "dashboard" });
      },

      answerDecision: (scenario, choiceId) => {
        const choice = scenario.choices.find((c) => c.id === choiceId);
        if (!choice) return;
        const date = todayKey();
        const state = get();
        if (state.decisions.some((d) => d.date === date)) return; // already answered today
        set({
          decisions: [
            ...state.decisions,
            {
              date,
              scenarioId: scenario.id,
              choiceId: choice.id,
              impact: choice.futureImpact,
              weeksShift: choice.weeksShift,
            },
          ],
        });
      },

      toggleMission: (missionId, date = todayKey()) => {
        const state = get();
        const exists = state.completedMissions.some(
          (cm) => cm.missionId === missionId && cm.date === date,
        );
        if (exists) {
          set({
            completedMissions: state.completedMissions.filter(
              (cm) => !(cm.missionId === missionId && cm.date === date),
            ),
          });
        } else {
          set({
            completedMissions: [...state.completedMissions, { missionId, date }],
          });
        }
      },

      addJournalEntry: (text) => {
        const entry = {
          id: `${Date.now()}`,
          date: todayKey(),
          text,
        };
        set({ journal: [entry, ...get().journal] });
      },

      sendChatMessage: (text) => {
        const state = get();
        const userMsg: ChatMessage = {
          id: `${Date.now()}-u`,
          role: "user",
          text,
          date: new Date().toISOString(),
        };
        const replyText = generateFutureSelfReply(text, state);
        const replyMsg: ChatMessage = {
          id: `${Date.now()}-f`,
          role: "future-self",
          text: replyText,
          date: new Date().toISOString(),
        };
        set({ chat: [...state.chat, userMsg, replyMsg] });
      },

      resetSimulation: () => set({ ...initialState, screen: "landing" }),
    }),
    {
      name: "alter-simulator-store",
    },
  ),
);
