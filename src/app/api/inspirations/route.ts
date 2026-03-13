import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildInspirationPrompt } from "@/lib/prompts";
import { safeParseJSON } from "@/lib/parseJSON";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const MAX_RETRIES = 2;

  try {
    const { niche } = await req.json();
    const prompt = buildInspirationPrompt(niche || "");

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt + (attempt > 0 ? "\n\nВАЖНО: Ответ должен быть ТОЛЬКО валидный JSON без комментариев и текста до/после." : "") }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";

      try {
        const data = safeParseJSON(text);
        return NextResponse.json(data);
      } catch (parseError) {
        if (attempt === MAX_RETRIES) {
          return NextResponse.json({
            error: `JSON parse error after ${MAX_RETRIES + 1} attempts: ${parseError instanceof Error ? parseError.message : "unknown"}`,
          }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
