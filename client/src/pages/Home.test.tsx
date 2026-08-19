import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/trpc", () => ({
  trpc: {
    portfolio: {
      publicContent: {
        useQuery: () => ({ data: undefined, isLoading: false, error: null }),
      },
    },
  },
}));

import Home from "./Home";

describe("public contact section", () => {
  it("removes the contact form while preserving direct contact and social actions", () => {
    const html = renderToStaticMarkup(<Home />);

    expect(html).toContain("contact-without-form");
    expect(html).not.toContain("reference-form");
    expect(html).not.toContain('placeholder="Your name"');
    expect(html).toContain("mailto:fedinasri.fsb@gmail.com");
    expect(html).toContain("https://www.linkedin.com/in/fedinasri");
    expect(html).toContain("https://github.com/Fedi-Nasri");
  });
});
