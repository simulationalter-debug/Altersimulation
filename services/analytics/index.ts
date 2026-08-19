/**
 * Analytics service boundary. No analytics provider is wired up yet.
 * Key events worth tracking once one is: onboarding_completed,
 * decision_made, mission_completed, streak_milestone, chat_message_sent,
 * paywall_viewed, upgrade_clicked.
 */
export type AnalyticsEvent =
  | "onboarding_completed"
  | "decision_made"
  | "mission_completed"
  | "streak_milestone"
  | "chat_message_sent"
  | "paywall_viewed"
  | "upgrade_clicked";

export interface AnalyticsService {
  track: (event: AnalyticsEvent, props?: Record<string, unknown>) => void;
}

export const localAnalyticsService: AnalyticsService = {
  track(event, props) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[analytics] ${event}`, props ?? {});
    }
  },
};
