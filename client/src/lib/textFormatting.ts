export type TextFormatKind = "bold" | "italic" | "underline" | "small" | "lead" | "clear";

export function formatSelectedText(current: string, start: number, end: number, kind: TextFormatKind) {
  if (start < 0 || end > current.length || start >= end) return current;
  const selected = current.slice(start, end);
  const token = kind === "bold" ? `**${selected}**`
    : kind === "italic" ? `_${selected}_`
      : kind === "underline" ? `__${selected}__`
        : kind === "small" ? `[[size:small]]${selected}[[/size]]`
          : kind === "lead" ? `[[size:lead]]${selected}[[/size]]`
            : selected.replace(/\*\*|__|_|\[\[size:(small|lead)\]\]|\[\[\/size\]\]/g, "");
  return `${current.slice(0, start)}${token}${current.slice(end)}`;
}
