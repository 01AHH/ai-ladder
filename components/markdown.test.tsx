import { render } from "@testing-library/react";
import { renderInlineMarkdown, renderEssay } from "./markdown";

describe("renderInlineMarkdown", () => {
  it("renders bold, italic, and links", () => {
    const { container } = render(
      <p>{renderInlineMarkdown("a **bold** and *ital* and [link](https://x.y)")}</p>
    );
    expect(container.querySelector("strong")?.textContent).toBe("bold");
    expect(container.querySelector("em")?.textContent).toBe("ital");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("https://x.y");
  });
});

describe("renderEssay", () => {
  it("renders headings, paragraphs, and lists", () => {
    const { container } = render(
      <div>{renderEssay("# Title\n\nBody text.\n\n- one\n- two")}</div>
    );
    expect(container.querySelector("h3")?.textContent).toBe("Title");
    expect(container.querySelector("p")?.textContent).toBe("Body text.");
    expect(container.querySelectorAll("li").length).toBe(2);
  });
});
