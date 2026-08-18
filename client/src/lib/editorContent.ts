import type { PortfolioContent } from "@shared/portfolio";

export type ContentPath = (string | number)[];

export function readAtPath(source: unknown, path: ContentPath): unknown {
  return path.reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") return (current as Record<string, unknown>)[String(segment)];
    return undefined;
  }, source);
}

export function updateAtPath(source: PortfolioContent, path: ContentPath, value: unknown): PortfolioContent {
  const copy = structuredClone(source) as Record<string, unknown>;
  let target: Record<string, unknown> | unknown[] = copy;
  path.slice(0, -1).forEach((segment) => {
    target = target[segment as never] as Record<string, unknown> | unknown[];
  });
  target[path[path.length - 1] as never] = value as never;
  return copy as PortfolioContent;
}

export function transformList(source: PortfolioContent, path: ContentPath, transform: (items: unknown[]) => unknown[]): PortfolioContent {
  const current = readAtPath(source, path);
  if (!Array.isArray(current)) return source;
  return updateAtPath(source, path, transform(structuredClone(current)));
}

export function duplicateListItem(source: PortfolioContent, path: ContentPath, index: number): PortfolioContent {
  return transformList(source, path, (items) => {
    if (index < 0 || index >= items.length) return items;
    items.splice(index + 1, 0, structuredClone(items[index]));
    return items;
  });
}

export function moveListItem(source: PortfolioContent, path: ContentPath, index: number, direction: -1 | 1): PortfolioContent {
  return transformList(source, path, (items) => {
    const destination = index + direction;
    if (index < 0 || destination < 0 || destination >= items.length) return items;
    [items[index], items[destination]] = [items[destination], items[index]];
    return items;
  });
}

export function removeListItem(source: PortfolioContent, path: ContentPath, index: number): PortfolioContent {
  return transformList(source, path, (items) => {
    if (items.length <= 1 || index < 0 || index >= items.length) return items;
    items.splice(index, 1);
    return items;
  });
}

export function appendAboutTag(source: PortfolioContent, tag = "New tag"): PortfolioContent {
  return updateAtPath(source, ["about", "tags"], [...source.about.tags, tag]);
}

export function appendAboutStat(source: PortfolioContent, stat: PortfolioContent["about"]["stats"][number] = { value: "00", label: "New statistic" }): PortfolioContent {
  return updateAtPath(source, ["about", "stats"], [...source.about.stats, stat]);
}
