# Preview Verification Evidence

> Working record for the `deployment_versel` Preview deployment. This file records observed behaviour only; it is not a release declaration.

## 2026-08-22 — editor and PostgreSQL draft workflow

- Preview URL verified: `https://portfolio-j6678emwj-fedi-s-projects2.vercel.app/edit`.
- The deployed editor loaded and the Vercel runtime log showed successful `200` requests for `portfolio.editorContent`, `portfolio.createDraft`, `portfolio.saveDraft`, and `portfolio.publish` on the Preview host.
- A private `Draft 2` was present after creation. It could be selected independently from `Main portfolio`, which retained its **Public** status.
- A version note, `Vercel Preview PostgreSQL persistence verification`, was saved on Draft 2 version 2 and remained visible after a page reload.
- The private draft later showed version 3, providing evidence that restore-as-new-version created an additional immutable version during the interactive verification flow. The public Main draft was not deliberately selected, published, or deleted during this verification.

## Media verification status

- Vercel runtime logs include successful `200` calls to `assets.upload` on the Preview host. The editor’s Home section exposes portrait and focus-visual upload controls in Draft 2.
- The authenticated Vercel Storage interface shows the public `portfolio-blob` store connected to both **Preview** and **Production**. Its usage counters report 398 kB stored, five simple operations, three advanced operations, and a `portfolio-editor/` object prefix.
- Within `portfolio-editor/portrait/`, Vercel lists two public JPEG objects, each 22.3 kB, created by the deployed editor workflow about 12–13 minutes before this inspection. Together with the Preview `200` upload logs, this verifies that media bytes reach Vercel Blob through the deployed upload handler.
- A direct unauthenticated shell request to the Preview `assets.upload` endpoint returned `401`; this does not invalidate the browser-session upload path and must not be interpreted as a Blob failure.
- The generic project SQL console is attached to the legacy sandbox MySQL database, not the connected Vercel PostgreSQL host. Its failed metadata-table count query is therefore not evidence about the Preview deployment or Neon-hosted PostgreSQL.
- Direct browser-session upload, Blob URL rendering, and metadata-row confirmation remain the next evidence to collect.

## Post-checkpoint Preview redeployment

After the verification and documentation checkpoint was pushed as commit `91c8713` to `deployment_versel`, Vercel created a new **Ready** Preview at `https://portfolio-7ymbsxgog-fedi-s-projects2.vercel.app`. Its `GET /api/trpc/auth.me` response was the expected tRPC JSON payload (`{"result":{"data":{"json":null}}}`), and `/edit` loaded the full workspace with `Main portfolio` still marked **Public** and private `Draft 2` still present at version 3. No production action was taken.

## Historical media inventory and safe migration boundary

The seeded portfolio model still contains seven legacy `/manus-storage/` references. Four project visuals and the Coursera certificate PDF/preview have matching source files in `/home/ubuntu/webdev-static-assets/`; the original portrait file is not available there, although two recently uploaded portrait JPEG objects are visible in the Vercel Blob store. The project files are PNG-encoded 2304×1536 images despite their `.jpg` filenames, so a correct migration should use `image/png` metadata or rename copies before upload.

| Legacy reference group | Count | Local source status | Safe next action |
|---|---:|---|---|
| Hero portrait | 1 | Original source not present; Blob contains two recent portrait JPEGs | Select the intended portrait in a **private** draft before replacing any saved reference. |
| Project visuals | 4 | All source files present; each is 3.6–3.9 MB and within the 5 MB upload limit | Upload through the editor/server API into a private draft, preserving accurate PNG MIME metadata. |
| Certificate PDF | 1 | Source present; 348 kB and within the 12 MB PDF upload limit | Upload through a private draft certificate control, then verify the viewer URL. |
| Certificate preview | 1 | Source present; 812 kB PNG | Re-upload only if the public layout still needs a separate preview asset. |

> Do not bulk-update `Main portfolio`, the default TypeScript seed, or the Production deployment as part of this inventory. A migration should first create a named private draft, upload one category at a time through the deployed server endpoint so PostgreSQL metadata is written, save an immutable version, and inspect the rendered Preview before any public-selection decision.
