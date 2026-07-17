import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("shows the current mode and switches on click", () => {
    const setTheme = vi.fn();
    render(<ThemeToggle theme="light" setTheme={setTheme} />);
    const btn = screen.getByRole("button", { name: /switch to interface mode/i });
    fireEvent.click(btn);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches back to paper from dark", () => {
    const setTheme = vi.fn();
    render(<ThemeToggle theme="dark" setTheme={setTheme} />);
    fireEvent.click(screen.getByRole("button", { name: /switch to paper mode/i }));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});
