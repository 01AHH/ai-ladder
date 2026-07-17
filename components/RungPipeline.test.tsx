import { render, screen } from "@testing-library/react";
import { RungPipeline } from "./RungPipeline";
import { rungs } from "@/content/rungs";

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungs = rungs.filter((r) => !Number.isInteger(r.number));

describe("RungPipeline", () => {
  it("renders one chip per integer rung, linking to its anchor", () => {
    render(<RungPipeline activeScene="hero" />);
    for (const r of mainRungs) {
      const chip = screen.getByRole("link", {
        name: `${String(r.number).padStart(2, "0")} ${r.name}`,
      });
      expect(chip).toHaveAttribute("href", `#rung-${r.number}`);
    }
  });

  it("marks the chip matching activeScene as active", () => {
    render(<RungPipeline activeScene="agents" />);
    const active = screen.getByRole("link", { name: "03 Coding agents" });
    expect(active.className).toContain("active");
    const inactive = screen.getByRole("link", { name: "01 Prompting" });
    expect(inactive.className).not.toContain("active");
  });

  it("renders sub-rungs as tick links with their names", () => {
    render(<RungPipeline activeScene="hero" />);
    for (const s of subRungs) {
      const tick = screen.getByRole("link", {
        name: `${s.number} — ${s.name}`,
      });
      expect(tick).toHaveAttribute("href", `#rung-${s.number}`);
    }
  });
});
