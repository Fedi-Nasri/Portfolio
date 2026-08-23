import React, { type CSSProperties } from "react";
import { Activity, CloudCog, Network, ShieldCheck, Workflow, Wrench, type LucideIcon } from "lucide-react";
import { siDocker, siGithubactions, siGit, siGnubash, siGrafana, siKubernetes, siLinux, siPrometheus, siSonar, siTerraform, siTrivy, type SimpleIcon } from "simple-icons";

const ROLE_ICONS: Record<string, LucideIcon> = {
  "cloud engineering": CloudCog,
  "devops engineering": Workflow,
  devsecops: ShieldCheck,
  "network operations": Network,
  "site reliability": Activity,
};

const TOOL_MARKS: Record<string, SimpleIcon> = {
  "bash scripting": siGnubash,
  "ci/cd pipelines": siGithubactions,
  docker: siDocker,
  "docker compose": siDocker,
  git: siGit,
  grafana: siGrafana,
  "github actions": siGithubactions,
  kubernetes: siKubernetes,
  linux: siLinux,
  prometheus: siPrometheus,
  sonarqube: siSonar,
  terraform: siTerraform,
  trivy: siTrivy,
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

/** A neutral role symbol; the editable role text remains the accessible label. */
export function ToolboxRoleIcon({ role }: { role?: string }) {
  const Icon = ROLE_ICONS[normalize(role ?? "")] ?? Wrench;

  return <span className="toolbox-role-icon" data-role={normalize(role ?? "custom")} aria-hidden="true"><Icon size={17} strokeWidth={2.1} /></span>;
}

/**
 * Displays a Simple Icons vector only for tools with a supported brand mark.
 * All other tools receive a neutral wrench fallback rather than an invented logo.
 */
export function ToolboxToolMark({ tool }: { tool: string }) {
  const icon = TOOL_MARKS[normalize(tool)];

  if (!icon) {
    return <span className="tool-brand-fallback" aria-hidden="true"><Wrench size={11} strokeWidth={2.25} /></span>;
  }

  return <span className="tool-brand-mark" style={{ "--tool-brand": `#${icon.hex}` } as CSSProperties} aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d={icon.path} /></svg></span>;
}
