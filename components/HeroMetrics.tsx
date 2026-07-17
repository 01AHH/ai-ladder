import { rungs } from "@/content/rungs";

export function countDistinctTools(list: { tools: string[] }[]): number {
  return new Set(list.flatMap((r) => r.tools)).size;
}

export function HeroMetrics() {
  const rungCount = rungs.filter((r) => Number.isInteger(r.number)).length;
  const metrics = [
    { n: String(rungCount).padStart(2, "0"), label: "rungs to climb" },
    { n: String(countDistinctTools(rungs)), label: "tools mapped" },
    { n: "01", label: "step at a time", accent: true },
    { n: "00", label: "tracking" },
  ];
  return (
    <div className="metrics" role="list" aria-label="This page in numbers">
      {metrics.map((m) => (
        <div
          className="metric"
          role="listitem"
          key={m.label}
          data-accent={m.accent ? "true" : undefined}
        >
          <span className="metric-n">{m.n}</span>
          <span className="metric-label">{m.label}</span>
        </div>
      ))}
    </div>
  );
}
