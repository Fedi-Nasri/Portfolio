# Detailed Release Runbook: `master` to Vercel Production

Use this runbook after a feature is complete on the current `master` baseline. `master` is Vercel’s Production Branch, so the final remote push is a deliberate live-release action, not an automatic step.

## Preconditions

| Requirement | Confirm before Production push |
|---|---|
| Source is based on `master` | Local source is current with `origin/master`; any feature branch was created from and reconciled into `master`. |
| Checklist is current | New work is in `todo.md`; completed and deliberately paused items are accurate. |
| Documentation is current | `docs/` and `ai-context/` describe changed contracts, risks, and deployment effects. |
| Local validation passes | `pnpm check`, `pnpm test`, and `pnpm build` pass. |
| API artifact is current | Run `pnpm build:vercel-api` when server/API code, dependencies, or routing changed. |
| Database migration is ready | Drizzle schema and a reviewed additive migration agree before a real PostgreSQL host is changed. |
| User approval is recorded | The user has approved this specific `master` Production push. |

## Standard release sequence

1. **Synchronize master.** Run `git switch master` and `git pull --ff-only origin master` before final validation.
2. **Review the exact change set.** Use `git status --short`, `git log --oneline origin/master..HEAD`, and `git diff --stat origin/master...HEAD`.
3. **Validate.** Run the required local checks; test private draft behavior when persistence or uploads change.
4. **Create a checkpoint.** Record the validated candidate and confirm the checklist is accurate.
5. **Obtain explicit Production approval.** A push to `master` creates a Production deployment.
6. **Push normally.** Run `git push origin master`; never force-push or rewrite branch history.
7. **Wait for Ready.** Review the Vercel Production deployment, build output, active commit, and Production URL.
8. **Smoke-test affected routes.** At minimum, test `/`, `/edit`, and `/api/trpc/auth.me` when server/API behavior is in scope.
9. **Record evidence.** Update `ai-context/current-work.md`, `issues.md`, and `change-log.md` with commit, URL, checks, and known limitations.

`deployment_versel` is not part of ordinary releases. Preserve it as a historical rollback reference unless the user directs a separate rollback or archival operation.

## Feature-specific validation matrix

| Change type | Required validation before master push | Production smoke test |
|---|---|---|
| Text or visual change | `pnpm check`, relevant Vitest, `pnpm build` | `/` and `/edit` at desktop and mobile widths. |
| New editor field | Shared type, editor, public renderer, export, persistence, tests | Save/reload a private draft and review public/editor parity. |
| New API/server behavior | `pnpm build:vercel-api`, full checks, API-bridge test | `/api/trpc/auth.me` returns JSON and the affected procedure works. |
| New PostgreSQL table/column | Schema, reviewed migration, query/service, tests | Test with a private draft; do not run destructive Production data experiments. |
| New image/PDF behavior | Blob handler, metadata path, editor UI, tests | Upload a safe private test asset and verify URL plus presentation. |
| Route or build configuration | `vercel.json`, API artifact, regression coverage | Reload `/edit`, test tRPC JSON, inspect Vercel logs. |

## Safe recovery choices

| Situation | Safe response |
|---|---|
| Production build fails | Fix the master source locally, revalidate, checkpoint, request new approval, and push a new normal commit. |
| API returns SPA HTML or 500 | Check `vercel.json`, regenerate the API bundle, inspect runtime logs, and verify `api/package.json` keeps the bundle CommonJS. |
| Draft data is incorrect | Use immutable draft history and restore as a new version; never overwrite or delete Main blindly. |
| Rollback is needed | Pause new pushes and use Vercel deployment history or the preserved `deployment_versel` release only with fresh explicit user direction. |

## References

[1]: https://vercel.com/docs/deployments/environments "Vercel environments"
[2]: https://vercel.com/docs/environment-variables "Vercel environment variables"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
