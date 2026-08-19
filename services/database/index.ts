/**
 * Database service boundary. The app currently persists everything to
 * localStorage via hooks/useAppStore (zustand `persist`) — there is no
 * live backend. This interface documents the shape a real adapter (e.g.
 * Supabase, see supabase/migrations for the matching schema) would
 * implement so the swap is additive: point useAppStore's persistence at
 * this interface instead of `localStorage` directly, without changing
 * any component.
 */
import type { Action, Goal } from "@/features/simulations/engine";
import type { ChatMessage, DecisionLogEntry, FutureSelf, JournalEntry } from "@/types";

export interface UserProfile {
  userId: string;
  futureSelf: FutureSelf;
}

export interface DatabaseService {
  getProfile: (userId: string) => Promise<UserProfile | null>;
  saveProfile: (profile: UserProfile) => Promise<void>;

  listGoals: (userId: string) => Promise<Goal[]>;
  upsertGoal: (userId: string, goal: Goal) => Promise<void>;

  listActions: (userId: string) => Promise<Action[]>;
  appendAction: (userId: string, action: Action) => Promise<void>;

  listDecisions: (userId: string) => Promise<DecisionLogEntry[]>;
  appendDecision: (userId: string, entry: DecisionLogEntry) => Promise<void>;

  listJournalEntries: (userId: string) => Promise<JournalEntry[]>;
  appendJournalEntry: (userId: string, entry: JournalEntry) => Promise<void>;

  listChatMessages: (userId: string) => Promise<ChatMessage[]>;
  appendChatMessage: (userId: string, message: ChatMessage) => Promise<void>;
}

/**
 * Not implemented: there's no live Supabase project configured yet
 * (see supabase/migrations for the schema this would read/write).
 * Throwing here — rather than silently no-op-ing — makes it obvious the
 * moment something tries to use this before a real adapter exists.
 */
export const unconfiguredDatabaseService: DatabaseService = new Proxy({} as DatabaseService, {
  get() {
    throw new Error(
      "No database backend is configured. The app currently persists via hooks/useAppStore " +
        "(localStorage). Implement DatabaseService against Supabase (see supabase/migrations) " +
        "to enable real sync.",
    );
  },
});
