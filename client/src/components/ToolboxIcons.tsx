import React from "react";
import { Activity, CloudCog, Network, ShieldCheck, Workflow, Wrench, type LucideIcon } from "lucide-react";

const ROLE_ICONS: Record<string, LucideIcon> = {
  "cloud engineering": CloudCog,
  "devops engineering": Workflow,
  devsecops: ShieldCheck,
  "network operations": Network,
  "site reliability": Activity,
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

/** A neutral role symbol; the editable role text remains the accessible label. */
export function ToolboxRoleIcon({ role }: { role?: string }) {
  const Icon = ROLE_ICONS[normalize(role ?? "")] ?? Wrench;

  return <span className="toolbox-role-icon" data-role={normalize(role ?? "custom")} aria-hidden="true"><Icon size={17} strokeWidth={2.1} /></span>;
}
