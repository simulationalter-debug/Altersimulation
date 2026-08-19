/**
 * AI service boundary. `generateFutureSelfReply` is currently a
 * deterministic, engine-grounded response generator (see
 * futureSelfChat.ts) — no external LLM call, so the app runs fully
 * offline. It's exposed as a service (not a plain util) so a real model
 * call can replace the implementation later without touching callers:
 * the contract is "text in, text out, given the same AppState the rest
 * of the app already reads from."
 */
export { generateFutureSelfReply } from "./futureSelfChat";
