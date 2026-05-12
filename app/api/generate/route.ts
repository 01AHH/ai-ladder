import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { rungs } from "@/content/rungs";
import { buildSystemPrompt, loadCoachPrompt, varsFromRung } from "@/lib/coach";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

type Body = { context: string; rung_id: string };

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response("Set ANTHROPIC_API_KEY to try this.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("Bad request body", { status: 400 });
  }

  const rungIndex = rungs.findIndex((r) => r.id === body.rung_id);
  if (rungIndex === -1) {
    return new Response("Unknown rung", { status: 400 });
  }

  const ip = getClientIp(req);
  const { allowed, resetAt } = checkRateLimit(ip);
  if (!allowed) {
    const hours = Math.ceil((resetAt - Date.now()) / (60 * 60 * 1000));
    return new Response(
      `Daily limit reached on this IP. Try again in ${hours}h, or clone the repo and run it yourself with your own key.`,
      { status: 429, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const rung = rungs[rungIndex];
  const nextRung = rungs[rungIndex + 1] ?? null;
  const vars = varsFromRung(rung, body.context ?? "", nextRung);
  const template = await loadCoachPrompt();
  const system = buildSystemPrompt(template, vars);

  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const response = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system,
          messages: [{ role: "user", content: "Generate the walkthrough now." }],
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.enqueue(encoder.encode("\n\n[Claude couldn't generate. Try again.]"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
