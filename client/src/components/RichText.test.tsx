import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RichText } from "./RichText";

describe("RichText", () => {
  it("renders only the supported formatting tokens as safe React elements", () => {
    const html = renderToStaticMarkup(<RichText value="**Bold** _italic_ __underlined__ [[size:lead]]lead text[[/size]]" />);
    expect(html).toContain("<strong>Bold</strong>");
    expect(html).toContain("<em>italic</em>");
    expect(html).toContain("<u>underlined</u>");
    expect(html).toContain('class="rich-size-lead">lead text</span>');
  });
});
