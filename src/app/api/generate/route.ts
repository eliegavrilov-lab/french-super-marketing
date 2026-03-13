import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildDayPlanPrompt } from "@/lib/prompts";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const { date, warmupStage } = await req.json();
    const prompt = buildDayPlanPrompt(date, warmupStage || "awareness");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
