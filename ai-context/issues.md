# Active Issues, Risks, and Deferred Work

This file separates confirmed facts from unresolved risks. Do not mark an issue resolved merely because code was changed; record the verification that establishes resolution.

| ID | Status | Severity | Confirmed issue / risk | Next action |
|---|---|---|---|---|
| I-001 | Active | High | `/edit` and portfolio write procedures are intentionally unauthenticated. Anyone who can access a public deployment editor can modify portfolio content. | Keep direct access only by user choice. If security is requested, protect server write procedures as well as the UI route. |
| I-002 | Resolved | High | The source is provider-neutral PostgreSQL, the reviewed schema is applied on the connected host, and the deployed Preview completed a disposable draft create/save/reload/restore workflow. | Preserve the Preview evidence and repeat a scoped smoke test after any draft-persistence change. |
| I-003 | Resolved | High | Vercel Blob is integrated for new editor uploads; runtime logs show successful deployed uploads and the connected public store contains `portfolio-editor` media objects. | Preserve server-only Blob credentials and continue storing only asset metadata in PostgreSQL. |
| I-004 | Resolved | Medium | The Vercel-connected Neon database was created and `DATABASE_URL` was added without exposing its value. | Keep secrets out of source control and use Neon only as a host, not an application dependency. |
| I-005 | Active | Medium | Existing historical asset URLs use `/manus-storage/...`; a storage-provider move can break public media or static exports. | Define compatibility/migration strategy before removing Forge proxy paths. |
| I-006 | Active | Medium | The production build has a Vite chunk-size warning for a JavaScript chunk over 500 kB. | Evaluate code-splitting only when performance improvement is requested; do not refactor blindly. |
| I-007 | Active | Low | `todo.md` contains legacy historical checklist headings and Vercel items remain open. | Preserve history; update items accurately. Do not delete old checklist records. |
| I-008 | Resolved for Preview | High | The Vercel project now deploys the checkpointed `deployment_versel` source as the correct portfolio Preview. Main and production settings were not intentionally changed during remediation. | Keep future remediation commits on `deployment_versel`; request explicit user approval before any production promotion or branch-policy change. |
| I-009 | Resolved | High | The Preview API is now packaged as a self-contained CommonJS function. `GET /api/trpc/auth.me` returns tRPC JSON instead of the SPA or a function error, and `/edit` loads with live PostgreSQL persistence. | Rebuild `api/[...path].js` with `pnpm build:vercel-api` after server/API-source changes, then re-run the deployment checks. |
| I-010 | Active | Medium | The editor sends media through a Base64 JSON tRPC request. A 3.78 MB PNG-encoded project image was rejected upstream with `Request Entity Too Large` before Vercel logged an `assets.upload` request; a 236 kB JPEG derivative with the same dimensions succeeded and was saved in private Draft 2 version 4. | Until the transport is redesigned for direct client-to-Blob uploads, convert large legacy project images to compact JPEG/WebP derivatives before editor upload and preserve all original files outside the repository. |

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
