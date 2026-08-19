/**
 * Notifications service boundary. No push provider is wired up yet. The
 * product needs at least: a daily "today's missions/decision are ready"
 * nudge, a streak-at-risk reminder (evening, if nothing logged today),
 * and Ghost You's weekly comparison recap. Each becomes a `schedule()`
 * call once a real provider (e.g. web push, or a mobile push SDK) exists.
 */
export interface NotificationsService {
  schedule: (id: string, whenIso: string, title: string, body: string) => Promise<void>;
  cancel: (id: string) => Promise<void>;
}

export const localNotificationsService: NotificationsService = {
  async schedule(id, whenIso, title) {
    console.debug(`[notifications] would schedule "${title}" (${id}) for ${whenIso}`);
  },
  async cancel(id) {
    console.debug(`[notifications] would cancel ${id}`);
  },
};
