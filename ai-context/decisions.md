# Architecture and Product Decisions

This record holds decisions that a future agent must preserve unless the user explicitly changes them.

| ID | Decision | Status | Rationale and consequences |
|---|---|---|---|
| D-001 | Use a light white/pale-blue framed visual system. | Active | The user rejected dark/editorial and green-theme interpretations. Preserve white surfaces, pale blue surround, navy type, and royal-blue accent. |
| D-002 | Keep the hero portrait circular. | Active | Explicit user requirement and key identity feature. |
| D-003 | Use four focus cards: Cloud, DevOps, DevSecOps, Security & Networking. | Active | Explicit content model; preserve semantics and readable arc placement. |
| D-004 | Remove continuous floating animation from focus cards. | Active | Previous animation caused overlap and hidden information. Hover feedback is acceptable. |
| D-005 | `/edit` is a direct-access route without authentication. | Active, security-sensitive | The user explicitly requested removal of authentication. Do not reintroduce auth without request; do not characterize this as secure. |
| D-006 | Use a public-style full live preview, not an inspector-first editor. | Active | The user expects the editor to show the same visual design as the public desktop presentation. |
| D-007 | Store portfolio content as versioned full JSON snapshots. | Active | Simplifies coherent draft history across many heterogeneous editable sections. |
| D-008 | Restore older versions as a new immutable version. | Active | Protects newer history and gives non-destructive recovery. |
| D-009 | Keep a single selected public draft. | Active | Public portfolio must have an unambiguous source without deleting other working drafts. |
| D-010 | Store media in object storage and reference URLs in content. | Active | Avoids database BLOB bloat and preserves export/storage separation. |
| D-011 | Canvas uses freeform desktop layout with responsive stacked mobile fallback. | Active | Precision editing is useful on desktop, but mobile content must remain readable. |
| D-012 | Projects use alternating compact media rows with dominant text content. | Active | User requested left/right reference pattern and consistent media footprint. |
| D-013 | Static ZIP export is faithful to public behavior and includes local certificate PDFs. | Active | User explicitly requested offline-ready public-style export rather than minimal HTML only. |
| D-014 | Vercel deployment uses Vercel-connected services where appropriate. | Active | PostgreSQL application code remains provider-neutral while Neon is the current connected host. New asset bytes use Vercel Blob and metadata uses PostgreSQL. Preview is verified; Production remains a separate approval. |
| D-015 | Create and maintain `ai-context/` for future agent handoff. | Active | User requested project memory covering current work, history, design, architecture, and database details. |
| D-016 | Use provider-neutral PostgreSQL technology for the application database. | Active | The user explicitly requested PostgreSQL as the application technology, not a Neon-specific implementation. Use standard Drizzle PostgreSQL and `pg` interfaces; Neon is the current host and may be replaced by any compatible PostgreSQL provider without changing the data model. |
| D-017 | Treat `main` as stable development and `deployment_versel` as the Vercel-connected deployment branch. | Active | Build and validate feature work on `main`; move deliberate checkpointed candidates to `deployment_versel` for Preview verification. This does not authorize Production promotion, Production-branch changes, or domain changes. |
| D-018 | Mirror Vercel and API-bridge documentation in `main` while keeping deployed implementation on `deployment_versel`. | Active | Stable development needs the same operational knowledge, but copied documentation must not be mistaken for Vercel routing, generated API artifacts, or a Preview deployment. The `deployment_versel` branch remains the Vercel-connected implementation branch. |
| D-019 | Use `deployment_versel` as Vercel’s Production Branch. | Active, user-approved | On 2026-08-22 the user explicitly approved changing Vercel Production Environment Branch Tracking from `main` to `deployment_versel`. No existing deployment was redeployed. Future pushes to `deployment_versel` create Production Deployments and therefore need explicit release approval. |
| D-020 | Use one active development branch and optional local-only Docker Compose. | Active, user-approved | Build a feature once on `main`; treat `deployment_versel` as a protected, release-only branch and move reviewed changes there only with explicit user approval. Docker Compose provides isolated local PostgreSQL development only. Vercel remains the Production platform, so Compose must not include Vercel, Neon, Blob, or Production credentials. |
| D-021 | Integrate the reviewed public-motion prototype and navigation documentation into `main` only. | Completed, Production-gated | The user approved integration on 2026-08-23. GitHub merge commit `ce7df13` contains the feature and documentation; `deployment_versel` was intentionally left at `7ebeb84`. This is not a Production-release approval. |

## Decision rule

If a user request conflicts with one of these decisions, do not silently preserve the old behavior. Add a new decision record that states the superseding user instruction, update relevant docs/context, and identify migration/verification implications.
