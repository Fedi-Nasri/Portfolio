# Active Issues, Risks, and Deferred Work

This file separates confirmed facts from unresolved risks. Do not mark an issue resolved merely because code was changed; record the verification that establishes resolution.

| ID | Status | Severity | Confirmed issue / risk | Next action |
|---|---|---|---|---|
| I-001 | Active | High | `/edit` and portfolio write procedures are intentionally unauthenticated. Anyone who can access a public deployment editor can modify portfolio content. | Keep direct access only by user choice. If security is requested, protect server write procedures as well as the UI route. |
| I-002 | Paused | High | A Vercel-connected Neon PostgreSQL database was selected in the UI, but the project source uses MySQL/TiDB-specific Drizzle code. | On deployment resumption, verify resource existence, then plan/execute a full PostgreSQL port or choose a MySQL-compatible provider. |
| I-003 | Paused | High | Vercel Blob is not integrated; current upload/storage behavior expects Forge/S3 proxy variables. | Implement storage interface + Vercel Blob adapter before production editor uploads. |
| I-004 | Active | Medium | Vercel/Neon creation status is unconfirmed after user paused browser work. | Verify Storage list and environment binding before any migration/deploy work. |
| I-005 | Active | Medium | Existing historical asset URLs use `/manus-storage/...`; a storage-provider move can break public media or static exports. | Define compatibility/migration strategy before removing Forge proxy paths. |
| I-006 | Active | Medium | The production build has a Vite chunk-size warning for a JavaScript chunk over 500 kB. | Evaluate code-splitting only when performance improvement is requested; do not refactor blindly. |
| I-007 | Active | Low | `todo.md` contains legacy historical checklist headings and Vercel items remain open. | Preserve history; update items accurately. Do not delete old checklist records. |

## Known non-issues

| Item | Reason it is not currently a defect |
|---|---|
| No sign-in in `/edit` | Intentional user requirement, though it remains a deployment risk. |
| Browser changes vanish without Save | Expected design: editor state is local until Save version or Publish. |
| Restore creates another version | Expected non-destructive history behavior. |
| Hidden section remains in editor | Expected reversible visibility behavior. |
| Canvas mobile layout differs from desktop coordinates | Expected accessible responsive fallback. |

## Issue update format

When adding an issue, include: a stable ID, exact observed behavior, affected area/file or route, user impact, verified evidence, next action, and status. Use **hypothesis** wording until evidence confirms a cause.
