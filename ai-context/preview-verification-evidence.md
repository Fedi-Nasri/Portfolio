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
