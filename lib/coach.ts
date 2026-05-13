import fs from "node:fs/promises";
import path from "node:path";
import type { Rung } from "@/content/rungs";

export type CoachVars = {
  user_context: string;
  rung_id: string;
  rung_name: string;
  rung_brief: string;
  bridge_target: string;
};

export async function loadCoachPrompt(): Promise<string> {
  const promptPath = path.join(process.cwd(), "prompts", "coach.md");
  return fs.readFile(promptPath, "utf8");
}

export function buildSystemPrompt(template: string, vars: CoachVars): string {
  return template
    .replaceAll("{{user_context}}", vars.user_context)
    .replaceAll("{{rung_id}}", vars.rung_id)
    .replaceAll("{{rung_name}}", vars.rung_name)
    .replaceAll("{{rung_brief}}", vars.rung_brief)
    .replaceAll("{{bridge_target}}", vars.bridge_target);
}

export function varsFromRung(rung: Rung, userContext: string, nextRung: Rung | null): CoachVars {
  const bridge =
    nextRung && rung.bridgeTarget
      ? `${nextRung.name}. ${rung.bridgeTarget.hook}`
      : "null (this is the last step, use the closing line specified in the prompt)";

  return {
    user_context: userContext.trim(),
    rung_id: rung.id,
    rung_name: rung.name,
    rung_brief: rung.brief,
    bridge_target: bridge,
  };
}
