"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const presetPika =
  "Cyberpunk NFT avatar animation, neon glow, subtle camera zoom, digital glitch effects, " +
  "floating holographic particles, cinematic lighting, seamless loop, high quality, web3 style. " +
  "Settings: 1:1, 4–6s, medium motion, loop on.";

const presetIdea =
  "Идея коллекции: WEB4 Sentinel\n" +
  "• Визор: бегущая цифровая сетка\n" +
  "• Эффекты: неоновый пульс + глитч + частицы\n" +
  "• Редкости: Core / Neon / Legendary\n" +
  "Хочешь стиль: киберпанк, аниме или реализм?";

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Привет! Это «Заработок» — AI помощник для Web3/NFT. Могу: промпты для Pika, идеи коллекций, описания и посты для продаж за TON.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const uiMessages = useMemo(() => messages, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [uiMessages.length, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    try {
      const history = [...messages, { role: "user", content: trimmed }]
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "…" },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Ошибка: ${e?.message || "неизвестно"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([
      {
        role: "assistant",
        content:
          "Контекст очищен. Напиши задачу: Pika промпт, идея NFT, описание, пост для Telegram и т.д.",
      },
    ]);
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>Заработок</div>
            <div style={styles.subtitle}>AI для NFT / Web3 / Pika</div>
          </div>

          <div style={styles.headerRight}>
            <button style={styles.ghostBtn} onClick={reset}>
              Сброс
            </button>
          </div>
        </div>

        <div style={styles.toolbar}>
          <button
            style={styles.btn}
            onClick={() => send("Сделай промпт для Pika: " + presetPika)}
          >
            🧠 Prompts для Pika
          </button>
          <button
            style={styles.btn}
            onClick={() => send("Придумай идею NFT: " + presetIdea)}
          >
            🎨 Идея NFT
          </button>
          <button
            style={styles.btn}
            onClick={() =>
              send("Сделай продающий пост в Telegram для моего NFT пака (TON).")
            }
          >
            ✍️ Пост для Telegram
          </button>
        </div>

        <div style={styles.chat}>
          {uiMessages.map((m, idx) => (
            <div
              key={idx}
              style={{
                ...styles.msgRow,
                justifyContent:
                  m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.bubble,
                  ...(m.role === "user" ? styles.userBubble : styles.aiBubble),
                }}
              >
                <div style={styles.role}>{m.role === "user" ? "Ты" : "AI"}</div>
                <div style={styles.text}>{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
              <div style={{ ...styles.bubble, ...styles.aiBubble }}>
                <div style={styles.role}>AI</div>
                <div style={styles.text}>Печатает…</div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          style={styles.inputRow}
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напиши запрос…"
          />
          <button style={styles.sendBtn} type="submit" disabled={loading}>
            Отправить
          </button>
        </form>

        <div style={styles.footer}>
          Ключ Groq хранится на сервере (API route). Деплой: Vercel / Render.
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: "#0b0b12",
  },
  card: {
    width: "min(980px, 100%)",
    borderRadius: 18,
    background: "#121225",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  title: { fontSize: 18, fontWeight: 700, color: "white" },
  subtitle: { fontSize: 13, opacity: 0.75, color: "white", marginTop: 2 },
  headerRight: { display: "flex", gap: 10 },
  ghostBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "transparent",
    color: "white",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    padding: 16,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.12)",
    cursor: "pointer",
    fontSize: 14,
  },
  chat: {
    height: "min(62vh, 520px)",
    overflowY: "auto",
    padding: 16,
  },
  msgRow: { display: "flex", marginBottom: 12 },
  bubble: {
    maxWidth: "78%",
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.35,
  },
  userBubble: { background: "rgba(99, 102, 241, 0.20)", color: "white" },
  aiBubble: { background: "rgba(255,255,255,0.06)", color: "white" },
  role: { fontSize: 12, opacity: 0.75, marginBottom: 6 },
  text: { fontSize: 14 },
  inputRow: {
    display: "flex",
    gap: 10,
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    fontSize: 14,
  },
  sendBtn: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(34, 197, 94, 0.25)",
    border: "1px solid rgba(34, 197, 94, 0.35)",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
  footer: {
    padding: "10px 16px 14px",
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
};
