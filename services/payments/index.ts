/**
 * Payments service boundary for the ALTER+/Together/Family tiers (see
 * app/paywall). No payment provider is wired up yet — every user reads
 * as "free" and `upgrade()` is a no-op. Swap `localPaymentsService` for
 * a real RevenueCat/Stripe adapter behind this same interface.
 */
export type SubscriptionTier = "free" | "alter_plus" | "alter_together" | "alter_family";

export interface PaymentsService {
  getTier: () => Promise<SubscriptionTier>;
  upgrade: (tier: Exclude<SubscriptionTier, "free">) => Promise<{ ok: boolean; reason?: string }>;
  cancel: () => Promise<void>;
}

export const localPaymentsService: PaymentsService = {
  async getTier() {
    return "free";
  },
  async upgrade() {
    return { ok: false, reason: "No payment provider configured yet." };
  },
  async cancel() {
    // No-op — nothing to cancel without a real provider.
  },
};
