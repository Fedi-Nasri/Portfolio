# Active Issues, Risks, and Deferred Work

This file separates confirmed facts from unresolved risks. Do not mark an issue resolved merely because code was changed; record the verification that establishes resolution.

| ID | Status | Severity | Confirmed issue / risk | Next action |
|---|---|---|---|---|
| I-001 | Active | High | `/edit` and portfolio write procedures are intentionally unauthenticated. Anyone who can access a public deployment editor can modify portfolio content. | Keep direct access only by user choice. If security is requested, protect server write procedures as well as the UI route. |
| I-002 | Active | High | The source is provider-neutral PostgreSQL and the reviewed initial schema is applied and table-verified on the connected host, but no deployed Preview has yet exercised real draft persistence. | After explicit deployment approval, run disposable-draft save, restore, publish, and public-read smoke tests in Vercel Preview. |
| I-003 | Paused | High | Vercel Blob is not integrated; current upload/storage behavior expects Forge/S3 proxy variables. | Implement storage interface + Vercel Blob adapter before production editor uploads. |
| I-004 | Resolved | Medium | The Vercel-connected Neon database was created and `DATABASE_URL` was added without exposing its value. | Keep secrets out of source control and use Neon only as a host, not an application dependency. |
| I-005 | Active | Medium | Existing historical asset URLs use `/manus-storage/...`; a storage-provider move can break public media or static exports. | Define compatibility/migration strategy before removing Forge proxy paths. |
| I-006 | Active | Medium | The production build has a Vite chunk-size warning for a JavaScript chunk over 500 kB. | Evaluate code-splitting only when performance improvement is requested; do not refactor blindly. |
| I-007 | Active | Low | `todo.md` contains legacy historical checklist headings and Vercel items remain open. | Preserve history; update items accurately. Do not delete old checklist records. |
| I-008 | Active | High | The inspected Vercel project’s existing production URL returns bundled `server/index.ts` content instead of the portfolio UI. Its browser-visible project identifier also differs from the previously recorded target identifier, so the local checkpointed repository cannot yet be confirmed as that deployment’s source. | Reconcile the Vercel project, connected Git repository, root directory, build command, and output directory before requesting a Preview deployment. Do not write editor data to this production deployment. |
| I-009 | Active | High | Preview branch `deployment_versel` now deploys the correct portfolio UI, but `/api/trpc/*` first fell through to the SPA and then, after explicit routing, crashed with `ERR_MODULE_NOT_FOUND` for `/var/task/server/_core/app`. A legacy `@vercel/node` builder attempt failed before build because Vercel selected pnpm 9 and rejected the lockfile’s patched-dependency configuration. | Package the API bridge with all server dependencies using a Vercel-compatible build strategy, then verify `/api/trpc/auth.me`, `/edit`, and disposable draft persistence before production. |

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
