# Detailed Release Runbook: `main` to `deployment_versel`

Use this runbook after a feature is complete on `main`. It is deliberately written as a controlled handoff rather than an automatic merge-to-Production procedure.

## Preconditions

| Requirement | Confirm before branch handoff |
|---|---|
| Source is on `main` | The change is reviewed and represents the stable development baseline. |
| Checklist is current | New work is added to `todo.md`; completed items are marked accurately. |
| Documentation is current | `docs/` and `ai-context/` explain changed contracts, risks, or deployment effects. |
| Local validation passes | `pnpm check`, `pnpm test`, and `pnpm build` pass. |
| API artifact is current | Run `pnpm build:vercel-api` if anything under `server/`, `server/routers.ts`, API routing, or related server dependencies changed. |
| Database migration is ready | Drizzle schema and reviewed additive migration agree before changing a real PostgreSQL host. |

## Standard handoff sequence

1. **Create a checkpoint on `main`.** This makes the stable development state recoverable.
2. **Review the exact commit range.** Compare `main` with `deployment_versel`; move only the intended tested commits.
3. **Update `deployment_versel`.** Use the approved repository workflow. Do not rewrite remote history, force-push, or touch the Production branch configuration.
4. **Wait for the Vercel Preview build.** Check the deployment record, build output, and preview URL.
5. **Run Preview verification.** Test the routes and data behavior affected by the change.
6. **Record evidence.** Update `ai-context/current-work.md`, `issues.md`, and `change-log.md`; include known limitations rather than calling untested work complete.
7. **Decide separately about Production.** A Ready Preview is a release candidate—not a request or authorization to promote.

## Feature-specific handoff matrix

| Change type | Required code work | Required validation before `deployment_versel` | Preview smoke test |
|---|---|---|---|
| Text or visual change | Public and editor preview parity; tests if behavior changes | `pnpm check`, relevant Vitest, `pnpm build` | `/` and `/edit` render as intended at desktop and mobile widths. |
| New editor field | Shared `PortfolioContent`, editor controls, public renderer, export, persistence, tests | TypeScript, Vitest, export behavior | Save private draft, reload, verify public preview parity. |
| New API/server behavior | Router/service changes plus `pnpm build:vercel-api` | All standard checks plus API-bridge test | `/api/trpc` returns JSON; affected procedure works on Preview. |
| New PostgreSQL table/column | Schema, generated migration, migration review, query/service, test | Schema review, DB migration verification, tests | Test with a private draft; never perform destructive production data tests. |
| New image/PDF capability | Blob handler, metadata path, editor UI, test | Asset validation tests, build, API artifact | Upload a safe test file privately; verify URL and render/download behavior. |
| Route or build configuration | `vercel.json`, function artifact, regression test | `pnpm build:vercel-api`, all checks | Reload `/edit`; call `/api/trpc/auth.me`; inspect Vercel logs. |

## Vercel-specific checks

| Check | Project-specific expectation |
|---|---|
| Build command | `pnpm exec vite build` produces `dist/public`. |
| API bundle | `api/[...path].js` was regenerated from `server/vercel-api-handler.ts` when server behavior changed. |
| API route precedence | `/api/*` resolves before the SPA catch-all in `vercel.json`. |
| PostgreSQL | Preview has a valid server-only `DATABASE_URL`; never copy its value to source or chat. |
| Blob | `BLOB_READ_WRITE_TOKEN` is server-only; new Blob bytes correspond to PostgreSQL metadata records. |
| Editor risk | `/edit` is intentionally unauthenticated. Do not promote broadly without accepting or mitigating that risk. |

## Safe recovery choices

| Situation | Safe response |
|---|---|
| Preview build fails | Read build logs, fix the branch, validate locally, then submit another candidate. |
| API returns the SPA or 500 | Check `vercel.json`, regenerate the API bundle, inspect runtime logs, and verify `api/package.json` keeps the bundle CommonJS. |
| Draft data is incorrect | Use immutable draft history and restore as a new version; do not overwrite or delete Main blindly. |
| Migration is wrong | Stop rollout, do not improvise destructive SQL, inspect dependencies, and use provider recovery options if needed. |
| Blob upload is wrong | Preserve the object key/URL evidence, inspect the metadata record and server logs, then test a new private draft. |

## References

[1]: https://vercel.com/docs/deployments/environments "Vercel environments"
[2]: https://vercel.com/docs/environment-variables "Vercel environment variables"
[3]: https://vercel.com/docs/vercel-blob "Vercel Blob documentation"
