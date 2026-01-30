import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const runtime = "nodejs";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT =
  "Ты помощник по NFT/Web3/Telegram. Отвечай кратко и по делу. " +
  "Если пользователь просит промпт — дай готовый промпт и параметры. " +
  "Если не хватает данных — задай 1 короткий уточняющий вопрос.";

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMsg[] };

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const model = process.env.GROQ_MODEL || "llama3-70b-8192";

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.7,
      max_tokens: 700,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...(messages || [])],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ answer });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
