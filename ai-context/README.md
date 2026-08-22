# AI Context — Portfolio Continuation Kit

This folder is the **mandatory operating context** for any AI agent, developer, or editor who resumes work on the Fedi Nasri portfolio application. It is designed to prevent rediscovery work, incompatible feature changes, visual regression, accidental data loss, and false assumptions about deployment status.

> **Read this folder before editing code.** Start with this file, then read `current-work.md`, `product-context.md`, and the specialist record relevant to the requested task. Do not begin implementation until the task is reflected in `todo.md` and in `current-work.md`.

## Rapid onboarding order

| Order | Read this file | Purpose |
|---:|---|---|
| 1 | [`AI_AGENT_SYSTEM_PROMPT.md`](./AI_AGENT_SYSTEM_PROMPT.md) | Copy or apply the reusable project-specific operating prompt before delegating work to another AI. |
| 2 | [`current-work.md`](./current-work.md) | Establish active priorities, paused work, current blockers, next actions, and validation baseline. |
| 3 | [`architecture-diagram.md`](./architecture-diagram.md) | Trace the standalone frontend, backend, database, asset/PDF, export, and deployment-boundary diagrams. |
| 4 | [`product-context.md`](./product-context.md) | Understand what is being built, for whom, and the non-negotiable product/design decisions. |
| 5 | [`technical-architecture.md`](./technical-architecture.md) | Locate source ownership, API/data flows, and the existing concise architecture reference. |
| 6 | [`database-and-data.md`](./database-and-data.md) | Safely work with drafts, immutable snapshots, PostgreSQL migrations, stored URLs, and provider portability. |
| 7 | [`design-system.md`](./design-system.md) | Preserve public/editor visual parity, design tokens, responsive rules, interaction patterns, and accessibility. |
| 8 | [`feature-request-workflow-example.md`](./feature-request-workflow-example.md) | Follow a worked end-to-end example before implementing a cross-layer feature. |
| 9 | [`capability-map.md`](./capability-map.md) | Select design, frontend, data, storage, quality, and continuity capabilities for a request. |
| 10 | [`development-and-quality.md`](./development-and-quality.md) | Run the right local commands, tests, checks, screenshots, and checkpoint procedure. |
| 11 | [`branch-and-release-workflow.md`](./branch-and-release-workflow.md) | Distinguish stable `main` work from the Vercel-connected `deployment_versel` handoff and Preview verification flow. |
| 12 | [`decisions.md`](./decisions.md) and [`issues.md`](./issues.md) | Respect intentional decisions, active risks, and deferred work. |
| 13 | [`change-log.md`](./change-log.md) | Understand the implementation history and avoid reintroducing repaired issues. |

## What this folder is and is not

This folder is a **living technical memory**, not a substitute for source code. The code remains authoritative for implementation details, and the database remains authoritative for currently persisted editor data. When this context conflicts with code, treat the conflict as an issue, investigate it, and correct this context during the same work item.

It must never contain credentials, connection strings, API tokens, user passwords, private documents, or sensitive personally identifying information beyond the public contact information already intentionally present in the portfolio. Refer to environment-variable *names* only.

## Required update protocol

Every future agent must keep this context current in the same change set as a feature or fix.

| Event | Required AI-context update |
|---|---|
| New request or bug report | Add the task to `todo.md`; update `current-work.md` with priority, scope, and status. |
| Product/architecture decision | Add a dated record to `decisions.md`, including alternatives and consequences. |
| Discovery of a risk/blocker | Add or update an entry in `issues.md`; distinguish confirmed facts from hypotheses. |
| Schema, API, storage, or deployment change | Update `technical-architecture.md` and `database-and-data.md` as applicable. |
| Branch workflow, Vercel service, domain, or environment responsibility change | Update `branch-and-release-workflow.md` and the relevant `docs/vercel-deployment/` guide. |
| Visual or interaction change | Update `design-system.md` when it alters reusable rules or public/editor parity. |
| Checkpoint-worthy completed work | Add an entry to `change-log.md`, then update `current-work.md` and `todo.md`. |
| Validation run | Record the commands and result in `current-work.md` when they establish a new baseline. |

## Writing standard

Write durable facts, not speculative narratives. Use exact file paths, known route names, and verifiable status. Keep active work concise enough to scan, but preserve the reason behind a decision so a new agent understands **why** the project behaves as it does.

| Use | Avoid |
|---|---|
| “`/edit` is intentionally unauthenticated; write procedures are public.” | “The editor is probably public.” |
| “PostgreSQL is the application technology; Neon is one connected host.” | “The application is Neon-specific.” |
| “A restore writes a new immutable version.” | “Restore reverts history.” |
| “Update both public and live preview render paths.” | “Fix the page.” |

## Relationship to project documentation

The detailed long-form documentation in [`docs/`](../docs/README.md) is the durable developer manual. `ai-context/` is optimized for **stateful continuation**: what an agent needs to know today, what it must not change inadvertently, and where to go next.

The current source-of-truth paths are documented in [`technical-architecture.md`](./technical-architecture.md#source-map) and are linked again in each specialist record.
