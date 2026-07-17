import { render } from "@testing-library/react";
import { SplitFlap } from "./SplitFlap";

function stubMatchMedia(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduced-motion") ? reduced : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("SplitFlap", () => {
  it("renders the first word as one flap per character (padded)", () => {
    stubMatchMedia(true);
    const { container } = render(<SplitFlap words={["CLIMB", "POSSIBLE"]} />);
    const flaps = container.querySelectorAll(".flap");
    expect(flaps.length).toBe("POSSIBLE".length); // padded to longest word
    const text = Array.from(flaps).map((f) => f.textContent).join("");
    expect(text.trimEnd()).toBe("CLIMB");
  });

  it("does not cycle under reduced motion", () => {
    vi.useFakeTimers();
    stubMatchMedia(true);
    const { container } = render(
      <SplitFlap words={["CLIMB", "BUILD"]} interval={100} />
    );
    vi.advanceTimersByTime(1000);
    const text = Array.from(container.querySelectorAll(".flap"))
      .map((f) => f.textContent)
      .join("");
    expect(text.trimEnd()).toBe("CLIMB");
    vi.useRealTimers();
  });
});
