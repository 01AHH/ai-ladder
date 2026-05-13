import { rungs } from "@/content/rungs";

const SCENE_COLOR: Record<string, string> = {
  prompting: "#4D6A3A",
  vibe: "#DD7A3E",
  agents: "#3D2858",
  skills: "#3F4F58",
  memory: "#A88B62",
  repo: "#C99A1E",
  apis: "#1F5266",
  integrated: "#D67054",
};

const TAGS: Record<string, string> = {
  prompting: "the conversation, a sharp prompt against a frontier model",
  vibe: "describe an app, ship a real URL by tonight",
  agents: "the agent reads your repo and writes patches",
  skills: "behaviour you install — what the model does forever",
  memory: "knowledge you install — CLAUDE.md, /memory, the no-list",
  repo: "the working substrate, home for skills and memory",
  apis: "the model as a function in your codebase",
  integrated: "agents with hands on Gmail, Calendar, your CRM",
};

export function RungIndex() {
  return (
    <nav className="rung-index" aria-label="Quick jump to a rung">
      <div className="rix-head">
        <span className="lead">
          <span className="arrow">↓</span>The eight rungs
        </span>
        <span>Jump to any</span>
      </div>
      <div className="rix-list">
        {rungs.map((r) => (
          <a
            key={r.id}
            className="rix-row"
            href={`#rung-${r.number}`}
            style={{ ["--rix-color" as string]: SCENE_COLOR[r.sceneKey] ?? "#C7421E" }}
          >
            <span className="rix-num">{String(r.number).padStart(2, "0")}</span>
            <span className="rix-name">{r.name}</span>
            <span className="rix-tag">{TAGS[r.sceneKey] ?? r.tagline}</span>
            <span className="rix-arrow">↗</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
