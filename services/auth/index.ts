/**
 * Auth service boundary. No real auth provider is wired up yet — the app
 * runs single-user, local-only (see hooks/useAppStore). This interface is
 * the shape a Supabase Auth (or other) implementation would fill in:
 * swap `localAuthService` for a real adapter without touching callers.
 */
export interface AuthUser {
  id: string;
  email: string | null;
}

export interface AuthService {
  getCurrentUser: () => Promise<AuthUser | null>;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const LOCAL_USER_ID = "local-user";

/** Local-only stand-in: everyone is the same anonymous local user. */
export const localAuthService: AuthService = {
  async getCurrentUser() {
    return { id: LOCAL_USER_ID, email: null };
  },
  async signInWithEmail() {
    // No-op until a real auth provider (e.g. Supabase Auth) is wired up.
  },
  async signOut() {
    // No-op — see above.
  },
};
