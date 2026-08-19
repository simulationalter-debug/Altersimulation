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
    <div className="mx-auto flex h-[calc(100vh-3rem)] max-w-2xl flex-col sm:h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Ask {futureSelf.name}</h1>
        <p className="mt-1 text-white/50">
          Not a generic assistant — the version of you who's already living the goals you set.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {chat.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
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
                  ? "bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] text-[#0a0a12]"
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
        className="flex gap-2 border-t border-white/10 pt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Talk to your Future Self..."
          className="flex-1 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/40 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-gradient-to-r from-[#8b7bff] to-[#5aa9ff] px-5 py-2.5 text-sm font-semibold text-[#0a0a12] transition hover:brightness-110"
        >
          Send
        </button>
      </form>
    </div>
  );
}
