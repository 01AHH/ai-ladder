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

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungsAfter = (n: number) =>
  rungs.filter((r) => !Number.isInteger(r.number) && Math.floor(r.number) === n);

export function RungPipeline({ activeScene }: { activeScene: string }) {
  return (
    <nav className="pipeline-wrap" aria-label="Jump to a rung">
      <div className="pipe-head">
        <span className="lead">
          <span className="arrow">↓</span>The eight rungs
        </span>
        <span>Jump to any</span>
      </div>
      <div className="pipeline">
        {mainRungs.map((r, i) => (
          <span key={r.id} className="pipe-seg">
            <a
              className={`pipe-chip${r.sceneKey === activeScene ? " active" : ""}`}
              href={`#rung-${r.number}`}
              aria-label={`${String(r.number).padStart(2, "0")} ${r.name}`}
              style={{
                ["--pipe-color" as string]:
                  SCENE_COLOR[r.sceneKey] ?? "var(--accent)",
              }}
            >
              <span className="pipe-num">
                {String(r.number).padStart(2, "0")}
              </span>
              <span className="pipe-name">{r.name}</span>
            </a>
            {i < mainRungs.length - 1 && (
              <span className="pipe-link">
                {subRungsAfter(r.number).map((s) => (
                  <a
                    key={s.id}
                    className="pipe-tick"
                    href={`#rung-${s.number}`}
                    title={`${s.number} — ${s.name}`}
                    aria-label={`${s.number} — ${s.name}`}
                  />
                ))}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
