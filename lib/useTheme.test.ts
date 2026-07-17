import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

function stubMatchMedia(dark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("dark") ? dark : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("theme-dark");
  });

  it("follows system preference when nothing is stored", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("prefers a stored override over system preference", () => {
    stubMatchMedia(true);
    localStorage.setItem("ladder-theme", "light");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("persists setTheme and syncs the html class", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem("ladder-theme")).toBe("dark");
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
    act(() => result.current.setTheme("light"));
    expect(document.documentElement.classList.contains("theme-dark")).toBe(false);
  });
});
