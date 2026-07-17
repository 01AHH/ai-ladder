import { render, screen } from "@testing-library/react";
import { GenerateDemo } from "./GenerateDemo";
import { rungs } from "@/content/rungs";

const prompting = rungs.find((r) => r.id === "prompting")!;
const skills = rungs.find((r) => r.id === "skills")!;

describe("GenerateDemo", () => {
  it("renders the default idle label", () => {
    render(<GenerateDemo rung={prompting} getContext={() => ""} />);
    expect(
      screen.getByRole("button", { name: /Generate good personal example/ })
    ).toBeInTheDocument();
  });

  it("renders the skill label on the skills rung", () => {
    render(<GenerateDemo rung={skills} getContext={() => ""} />);
    expect(
      screen.getByRole("button", { name: /Generate my skill/ })
    ).toBeInTheDocument();
  });
});
