import { render, screen } from "@testing-library/react";
import { HeroMetrics, countDistinctTools } from "./HeroMetrics";
import { rungs } from "@/content/rungs";

describe("countDistinctTools", () => {
  it("counts distinct tool strings across rungs", () => {
    const fixture = [{ tools: ["a", "b"] }, { tools: ["b", "c"] }];
    expect(countDistinctTools(fixture)).toBe(3);
  });
});

describe("HeroMetrics", () => {
  it("renders the four metrics with computed values", () => {
    render(<HeroMetrics />);
    const rungCount = rungs.filter((r) => Number.isInteger(r.number)).length;
    expect(screen.getByText("rungs to climb")).toBeInTheDocument();
    expect(
      screen.getByText(String(rungCount).padStart(2, "0"))
    ).toBeInTheDocument();
    expect(screen.getByText("tools mapped")).toBeInTheDocument();
    expect(
      screen.getByText(String(countDistinctTools(rungs)))
    ).toBeInTheDocument();
    expect(screen.getByText("step at a time")).toBeInTheDocument();
    expect(screen.getByText("tracking")).toBeInTheDocument();
  });
});
