import { rungs } from "@/content/rungs";

const SCENE_COLOR: Record<string, string> = {
  prompting: "#4D6A3A",
  vibe: "#DD7A3E",
  agents: "#3D2858",
  repo: "#C99A1E",
  apis: "#1F5266",
  climax: "#14110D",
  integrated: "#D67054",
};

const TAGS: Record<string, string> = {
  prompting: "the conversation, a sharp prompt against a frontier model",
  vibe: "describe an app, ship a real URL by tonight",
  agents: "the agent reads your repo and writes patches",
  repo: "markdown as second brain, CLAUDE.md at the root",
  apis: "the model as a function in your codebase",
  climax: "what the model does forever, every time the trigger fires",
  integrated: "agents with hands on Gmail, Calendar, your CRM",
};

export function RungIndex() {
  return (
    <nav className="rung-index" aria-label="Quick jump to a rung">
      <div className="rix-head">
        <span className="lead">
          <span className="arrow">↓</span>The seven rungs
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
