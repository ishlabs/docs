# Repository Guidelines

## Commands
- `mint dev` — local preview at `localhost:3000` (run from the repo root, where `docs.json` lives)
- `mint broken-links` — check for dead internal links
- `mint update` — refresh the Mintlify CLI if `mint dev` misbehaves (`npm i -g mint` to install)

No lint or typecheck lives in this repo. Before declaring a task done, run `mint dev` to confirm pages render and `mint broken-links` to confirm no dead links.

## Architecture
Mintlify docs site deployed at `docs.ishlabs.io` (also reachable at `ishlabs.io/docs`). Pages are MDX with YAML frontmatter; navigation, theming, and redirects live in `docs.json`. It documents two products — the ish CLI (`@ishlabs/cli`) and the ish MCP server (`mcp.ishlabs.io`) — plus a shared `concepts/` core both depend on.

Hand-written pages: `concepts/`, `guides/`, `start/`, `integrations/`, `help/`, `index.mdx`, and the `cli/*.mdx` / `mcp/*.mdx` overview pages.

GENERATED — never hand-edit (each carries a "GENERATED FILE" banner; `.gitattributes` marks them `linguist-generated`): `cli/generated/**`, `mcp/generated/**`, `snippets/global-flags.mdx`, `snippets/exit-codes.mdx`. To change them, edit the SOURCE and regenerate:
- CLI: `node scripts/generate-docs-cli.mjs --out ../docs` in `ish-cli` (drift gate: `scripts/verify-docs-cli.mjs`).
- MCP: `uv run python scripts/generate_docs_mcp.py --out ../docs` in `ish-mcp` (drift gate: `scripts/verify_docs_mcp.py`).

The drift gates are the docs-lockstep mechanism, and they run in the source repos' CI, not here — a stale generated page fails there. Deploy is automatic: the Mintlify GitHub app publishes to production on push to the default branch.

## Conventions
`AGENTS.md` is the binding authoring contract for this repo — voice, terminology, banned words (no em/en dashes, no "insights"/"tester" in prose), one Diataxis mode per page, and the non-negotiable rule to verify every factual claim about a command, flag, or tool against current source code. Read it before writing or editing any page.

Global workflow rules load from `~/.claude/CLAUDE.md`. Product voice extends `../ish-frontend/.docs/content-style.md` (the canonical source `AGENTS.md` extracts from); docs prose follows the same register. This repo has no local ADR corpus — decisions binding docs and product live in the owning repo's ADR set (`ish-frontend/.docs/adr/`).
