import { render, screen, fireEvent } from "@testing-library/react";
import { RungGrid } from "./RungGrid";
import { rungs } from "@/content/rungs";

const mainRungs = rungs.filter((r) => Number.isInteger(r.number));
const subRungs = rungs.filter((r) => !Number.isInteger(r.number));
const noop = () => {};

describe("RungGrid", () => {
  it("renders a cell per integer rung and a slim row per sub-rung", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    expect(container.querySelectorAll(".if-cell").length).toBe(mainRungs.length);
    expect(container.querySelectorAll(".if-sub").length).toBe(subRungs.length);
  });

  it("opens one panel at a time with the rung's full content", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    fireEvent.click(screen.getByRole("button", { name: /01.*Prompting/i }));
    expect(container.querySelectorAll(".if-panel").length).toBe(1);
    const prompting = rungs.find((r) => r.id === "prompting")!;
    // plain renders in the cell AND the open panel — expect 2 while open
    expect(screen.getAllByText(prompting.plain).length).toBe(2);
    for (const t of prompting.tools) {
      expect(screen.getByText(t)).toBeInTheDocument();
    }
    fireEvent.click(screen.getByRole("button", { name: /02.*Vibe coding/i }));
    expect(container.querySelectorAll(".if-panel").length).toBe(1);
    // panel closed — only the cell copy remains
    expect(screen.getAllByText(prompting.plain).length).toBe(1);
  });

  it("every rung's panel carries a generate demo (full parity)", () => {
    const { container } = render(
      <RungGrid getContext={() => "ctx"} onReadOnPaper={noop} />
    );
    for (const r of rungs) {
      const opener = screen.getByRole("button", {
        name: new RegExp(`${String(r.number).replace(".", "\\.")}.*${r.name}`, "i"),
      });
      fireEvent.click(opener);
      expect(container.querySelectorAll(".generate").length).toBe(1);
    }
  });
});
