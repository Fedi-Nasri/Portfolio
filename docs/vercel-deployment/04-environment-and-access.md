# Environment Variables, Access, and Security

Environment variables configure the build and server function without putting credentials in Git. Vercel encrypts them at rest, scopes them by environment, and applies changes to **new** deployments rather than old deployments.[1] Write variable **names** in documentation, never their values.

## Variable inventory for this portfolio

| Variable | Scope | Purpose | Handling rule |
|---|---|---|---|
| `DATABASE_URL` | Server; Preview and Production as currently connected | PostgreSQL connection for drafts, versions, and media metadata. | Never disclose, commit, or paste the value. |
| `BLOB_READ_WRITE_TOKEN` | Server; connected Blob environments | Allows the server handler to create Vercel Blob objects. | Never expose to client-side code. |
| `JWT_SECRET` | Server | Supports framework cookie/session behavior. It does not protect the direct editor by itself. | Treat as secret. |
| `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY` | Server, only while legacy compatibility needs them | Supports remaining legacy Manus-storage compatibility behavior. | Treat as secret; remove only after the historical-media migration is complete. |
| `VITE_*` values | Build/client when used | Public build configuration such as analytics/application identifiers. | Anything prefixed `VITE_` can become visible in browser code; never put secrets here. |

## Scope each variable correctly

| Scope | Use in this portfolio | Rule |
|---|---|---|
| **Development** | Local development configuration. | Use a local secure file only; do not commit it. |
| **Preview** | `deployment_versel` release-candidate deployments. | Use a safe test-capable configuration. Preview-specific values can override general Preview values.[1] |
| **Production** | Public visitor-facing deployment. | Change only with explicit release approval. |

## Safe variable-change procedure

1. Identify the variable name, owner, environments, and reason for the change. Do not write the value in tickets, chat, docs, source, or commit messages.
2. Add or edit the value through **Project → Settings → Environment Variables**.
3. Select the minimum necessary scopes. Production values should not be changed merely to test a Preview change.
4. Create a new Preview deployment; existing deployments do not receive the changed value automatically.[1]
5. Test the affected behavior and inspect logs without printing secrets.
6. Record the change **category and scope**, not the value, in `ai-context/` if it alters architecture or operations.

## Access and the direct editor

The portfolio’s `/edit` route is intentionally unauthenticated. This is a product decision, not an access-control implementation. Vercel project access, deployment protection, and environment-variable access protect the Vercel project itself, but they do not replace server-side authorization for public write procedures.

| Goal | Appropriate action |
|---|---|
| Keep a Preview private while testing | Consider Vercel Deployment Protection, if available for the account and appropriate to the workflow. |
| Restrict who changes portfolio content | Implement server-side editor authorization before considering a broad public launch. |
| Limit secret exposure | Grant Vercel project access only to trusted collaborators and use server-only variables. |
| Rotate a leaked or outdated secret | Replace it in Vercel, create a new deployment, validate it, and remove the old credential at its provider. |

## References

[1]: https://vercel.com/docs/environment-variables "Vercel environment variables"
[2]: https://vercel.com/docs/environment-variables/managing-environment-variables "Managing Vercel environment variables"
[3]: https://vercel.com/docs/deployments/environments "Vercel environments"
