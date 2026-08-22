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
| D-014 | Vercel deployment should use Vercel-connected services when resumed. | Active, incomplete | A Vercel-connected Neon PostgreSQL host is now configured, but Blob storage, migration application, and production verification remain incomplete. |
| D-015 | Create and maintain `ai-context/` for future agent handoff. | Active | User requested project memory covering current work, history, design, architecture, and database details. |
| D-016 | Use provider-neutral PostgreSQL technology for the application database. | Active | The user explicitly requested PostgreSQL as the application technology, not a Neon-specific implementation. Use standard Drizzle PostgreSQL and `pg` interfaces; Neon is the current host and may be replaced by any compatible PostgreSQL provider without changing the data model. |

## Decision rule

If a user request conflicts with one of these decisions, do not silently preserve the old behavior. Add a new decision record that states the superseding user instruction, update relevant docs/context, and identify migration/verification implications.
