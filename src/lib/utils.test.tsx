import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class name strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("resolves conflicting tailwind utilities with tailwind-merge", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("omits falsy tailwind and class inputs from clsx", () => {
    expect(cn("base", false, undefined, null, "end")).toBe("base end");
  });
});

describe("cn in React trees", () => {
  it("produces merged classes on a rendered element", () => {
    render(<span className={cn("text-sm", "text-base")} data-testid="el" />);
    expect(screen.getByTestId("el")).toHaveClass("text-base");
  });
});
