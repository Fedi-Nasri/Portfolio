import React from "react";
import { Bot, CloudCog, Database, Layers3, Network, ServerCog, type LucideIcon } from "lucide-react";

const CAPABILITY_ICONS: LucideIcon[] = [ServerCog, CloudCog, Network, Database, Layers3, Bot];

export function CapabilityIcon({ index }: { index: number }) {
  const Icon = CAPABILITY_ICONS[index % CAPABILITY_ICONS.length];
  return <Icon aria-hidden="true" strokeWidth={1.8} />;
}
