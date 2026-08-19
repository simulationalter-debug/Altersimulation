import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store";

const SUGGESTIONS = [
  "I really want to order takeaway tonight",
  "Should I apply for this job?",
  "I'm too tired to go to the gym",
  "How are we actually doing?",
];

export default function Chat() {
  const futureSelf = useStore((s) => s.futureSelf);
  const chat = useStore((s) => s.chat);
  const sendChatMessage = useStore((s) => s.sendChatMessage);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  if (!futureSelf) return null;

  const submit = (text: string) => {
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] flex-col">
      <div className="border-b border-white/10 bg-gradient-to-br from-[#ec4899]/15 via-[#a855f7]/10 to-transparent px-4 pb-5 pt-6 text-center">
        <span className="text-3xl">{futureSelf.avatarEmoji}</span>
        <h1 className="mt-1 text-lg font-bold">Ask {futureSelf.name}</h1>
        <p className="mx-auto mt-1 max-w-xs text-xs text-white/50">
          Not a generic assistant — the version of you who's already living the goals you set.
        </p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {chat.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-white/60 transition hover:border-white/25 hover:text-white/90"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`animate-rise max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "grad-primary text-white"
                  : "border border-white/10 bg-white/[0.05] text-white/90"
              }`}
            >
              {m.role === "future-self" && (
                <p className="mb-1 text-xs font-semibold text-white/40">
                  {futureSelf.avatarEmoji} {futureSelf.name}
                </p>
              )}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="flex gap-2 border-t border-white/10 px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to your Future Self..."
          className="flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="grad-primary rounded-full px-5 py-2.5 text-sm font-semibold text-white transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
