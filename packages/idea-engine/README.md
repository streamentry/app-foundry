# @foundry/idea-engine

Shared engine for 100 **internal research prototypes**. It is not a shared consumer UI product.

- \`src/specs.ts\` — explicit schema for each idea; each has 2–10 job-specific fields.
- \`src/domain.ts\` — pure validation, calculations, sort, metrics, safe CSV, JSON backup format.
- \`src/App.tsx\` — 13 workflow UI categories, accessible native inputs and local CRUD.
- \`src/theme.ts\` — category-based exploratory light/dark palettes and contrast helpers.
- \`src/export.ts\` — user-initiated CSV/JSON export.
- Uses \`@foundry/mobile-kit\` to persist each idea in SQLite KV under its own namespace.

## Safety properties

Each export requires user action; the user chooses a destination. JSON restore validates the schema, app slug, record count, typed fields and duplicate IDs before a confirmation-gated replacement. Prevent spreadsheet formula injection in exported cells. No networking/telemetry/credentials.

## Known limitations

The renderer is generic and not enough to make 100 apps visually distinct for App Store review. Native widgets, OCR, evidence photos and specialized workflows are deferred. No auto-backup; export/import must be manually tested. Data migrations are required before changing any stored field or record format.

## Workflow

Run \`npm run idea:verify\` and \`npm run check\` (pure domain tests) before editing. Use \`npm run idea:lab\` for interactive evaluation. Promote a real app by replacing its generic screen with a **bespoke design** and target-user-tested interaction, not by changing the palette.
