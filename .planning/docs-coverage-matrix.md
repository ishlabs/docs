# ish docs — documentation coverage matrix

Canonical map of the documentation content space for the ish CLI + MCP docs site.
This file is the **backlog**: each row is one writer+reviewer work order. Reviewed by
Felix before any page is written. Adapted from the `coverage-matrix` skill (axes =
what varies; decision logic = the routing rule; every cell gets a verdict + failure
class).

A read-only HTML render of the tables lives at
`~/.claude/artifacts/ish-docs-coverage-matrix.html` for review. This Markdown is canonical.

---

## 1. Method

**Axes (what varies about a documentation need):**

| Axis | Values |
|---|---|
| **A. Audience** | `human` (builder/PM at a terminal) · `agent` (AI coding agent) · `dev` (the developer wiring the agent up) · `evaluator` (decision-maker, skims) · `ci` (automation/scripts) · `llm` (crawler, served by llms.txt) |
| **B. Mode** (Diataxis) | `tutorial` · `how-to` · `reference` · `explanation` |
| **C. Surface** | `cli` · `mcp` · `shared` (concepts both use) · `meta` (site itself) |
| **D. Journey** | `discover` → `connect` (install/auth/wire) → `first` (first reaction) → `iterate` → `slice` (read results) → `integrate` (CI/client) → `troubleshoot` → `reference` |

**Decision logic (the routing rule the matrix proves is total + unambiguous):**

> A need routes to a page by `mode → page shape`, then `surface → tab`, then
> `audience → voice register + prose-vs-machine`. Any fact about a shared concept routes
> to the single `concepts/*` page and is linked, never restated in a CLI or MCP page.

**Verdict per cell:** `covered` (a planned page serves it) · `gap` (real need, no page, must add)
· `at-risk` (page planned but exposed to a failure class) · `n/a` (not a real need).

**Failure classes (how a cell fails):**

- `DIATAXIS-BLEED` — page mixes modes (reference that teaches, tutorial that dumps options).
- `DUPLICATE-TRUTH` — same fact authored in two pages instead of one concept page linked.
- `STALE-SEED` — content lifted from `src/lib/docs.ts` / `ish_mcp/docs/` without re-verifying code.
- `VOICE-VIOLATION` — em-dash, banned term (`insights`/`tester`/puffery), wrong `ish` hedge.
- `ORPHAN` — page not in nav / no inbound link / unreachable in any journey.
- `OVER-DOC` — exhaustively documenting a flag surface no human reads (`study create` trap).
- `AUDIENCE-MISMATCH` — written for the wrong reader (MCP tool page written for a PM).

**gen column:** `A` authored · `G` fully generated from source · `G+A` generated body
(flag/param tables) with an authored intro + when-to-use + one worked example.

---

## 2. Source-of-truth ground (every reference row verifies against these)

- **CLI:** `ish-cli/src/index.ts` (Commander tree, global flags `:131-143`), `src/commands/*`
  (one module per namespace), `src/lib/docs.ts` (35 seed pages, fact-check only),
  `src/lib/enums.ts` / `types.ts` / `modality.ts` (enums), `src/lib/command-helpers.ts`
  (exit codes `:512-591`, confirmations, dispatch cap), `src/lib/auth.ts` (token order),
  `install.sh` / `install.ps1` / `package.json` / `Formula/ish.rb` (install).
- **MCP:** `ish-mcp/src/ish_mcp/tools/*.py` (43 tools), `resources/*.py` (10 resources),
  `compose.py`, `models/*.py` + `audience/filters.py` (nested schemas), `server.py`
  (`INSTRUCTIONS`), `client_info.py` (per-client), `auth/*.py` (OAuth), `aliases.py`,
  `tool_annotations.py`. Seed prose `ish_mcp/docs/` is fact-check only (it is stale).
- **Voice:** `ish-frontend/.docs/content-style.md` (binding) + `docs/AGENTS.md`.

The 43 user-facing MCP tools (confirmed against source + the live tool list), across
**12 domain tags**: `workspace_get/create/delete`, `brand_get/create/delete`,
`study_get/create/iterate/run/analyze/revise/update_iteration/delete/benchmark`,
`ask_get/run/round/questions/people/delete`, `person_generate/get/attach/delete`,
`source_upload` (tagged `person`), `simulation_cancel/extend`, `chatbot_setup/test/get/
delete/delete_configuration`, `connect`, `connect_status`, `upload_create`, `upload_status`,
`me_ask`, `me_get`, `site_access_get/set/clear`, `docs_get`. **10 `ish://` resources** (the
`docs` resource contributes two registrations, a list + a templated item), **0 prompts**.

**Generator caveats (verified):** the source has 44 tool decorators; one is local-only.
The MCP generator must boot `compose()` in hosted mode so `mcp.disable(tags={"local-only"})`
drops it, listing exactly the 43 user-facing tools. Count resources by AST / line-anchored
match (a docstring in `resources/__init__.py` contains the literal `@mcp.resource`, so a bare
grep false-counts 11). Both generators enumerate from `list_tools()` / `list_resources()` /
`list_resource_templates()`, so the live count is always authoritative.

---

## 3. The matrix

Page paths are relative to the docs root. `★` marks a page that is also a **nav landing**
(card grid / tab index).

### TAB: Guides → Get started

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GS-01 | `index` ★ | ish docs | explanation | shared | all | discover | Say what ish is in one screen and route to the right quickstart | server `INSTRUCTIONS`; content-style.md | A | P0 | covered |
| GS-02 | `start/cli-quickstart` | Quickstart: the CLI | tutorial | cli | human | first | Install, sign in, simulate one visit, read one reaction, under five minutes | README.md; `study-run.ts`; `install.sh` | A | P0 | covered |
| GS-03 | `start/connect-an-agent` | Quickstart: connect an AI agent | tutorial | mcp | agent,dev | connect | Wire ish into one client over MCP, verify, get one reaction | ish-mcp README; `docs/guides/mcp-add.md`; `mcp.ts` | A | P0 | covered |

### TAB: Guides → Core concepts (the shared spine, defined once)

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CO-01 | `concepts/overview` | How ish works | explanation | shared | all | discover | The mental model and the one diagram: workspace → study → iteration → run → reactions | server `INSTRUCTIONS`; `docs.ts` overview | A | P0 | covered |
| CO-02 | `concepts/workspace` | Workspaces | explanation | shared | all | discover | What a workspace is; how MCP `brand` relates | `workspaces.py`; `brands.py`; `docs.ts` concepts/workspace | A | P0 | covered |
| CO-03 | `concepts/study` | Studies | explanation | shared | all | discover | The persistent unit: show something, get reactions | `studies.py`; `docs.ts` concepts/study | A | P0 | covered |
| CO-04 | `concepts/iteration` | Iterations | explanation | shared | all | iterate | A configured run carrying the artifact (URL/media/endpoint) | `study_add_iteration`; `iteration.ts`; `docs.ts` concepts/iteration | A | P1 | covered |
| CO-05 | `concepts/modalities` | Modalities | explanation | shared | all | discover | The seven modalities and their content types (single source of truth for modality meaning; CC-04 + MT-01 link here) | `modality.ts`; `types.ts`; MCP `ish://reference/content-types/{modality}` resource + backend content-types endpoint (per-modality content_type lists come from the API, not `modality.ts` alone) | A | P1 | covered |
| CO-06 | `concepts/run-vs-ask` | Runs and asks | explanation | shared | all | first | The two run verbs and when each fits | `docs.ts` run-verbs; `study-run.ts`; `asks.py` | A | P0 | covered |
| CO-07 | `concepts/people` | People and audiences | explanation | shared | all | discover | Simulated person, audience selection, visibility (workspace/shared/platform) | `people.py`; `person.ts`; `docs.ts` concepts/person+people | A | P0 | covered |
| CO-08 | `concepts/source` | Sources | explanation | shared | all | iterate | The grounding evidence behind a person | `source.ts`; `source_upload`; `docs.ts` concepts/source | A | P1 | covered |
| CO-09 | `concepts/assignment-questionnaire` | Assignments and questionnaires | explanation | shared | all | iterate | What people are asked to do, and what they answer | `docs.ts` concepts/assignment+questionnaire; models | A | P1 | covered |
| CO-10 | `concepts/ask-and-round` | Asks and rounds | explanation | shared | all | iterate | The comparison building blocks: variants, picks, ratings, follow-up rounds | `docs.ts` concepts/ask+round; `asks.py` | A | P1 | covered |
| CO-11 | `concepts/reactions-and-results` | Reactions and results | explanation | shared | all,evaluator | slice | What a run produces: transcripts, clips, signals, the reasoning (not a score) | `study_get` views; `study-run` results; content-style.md | A | P0 | covered |
| CO-12 | `concepts/site-access` | Site access | explanation | shared | dev,human | connect | How ish reaches what it reacts to: public, basic-auth, cookie, login | `site_access.py`; `workspace.ts` site-access; `docs.ts` | A | P1 | covered |
| CO-13 | `concepts/active-context` | Active context | explanation | shared | all | first | The active workspace/study/ask both surfaces carry | `command-helpers.ts`; `docs.ts` concepts/active-context | A | P1 | covered |
| CO-14 | `concepts/credits-and-limits` | Credits and limits | explanation | shared | all,evaluator | discover | Credits as a usage allowance; plan limits; the 20-sim dispatch cap | `docs.ts` reference/credits+billing-limits; `command-helpers` | A | P1 | covered |
| CO-15 | `concepts/sharing` | Sharing results | explanation | shared | human,evaluator | slice | Public no-login result links | `study-share.ts`; `docs.ts` concepts/sharing | A | P1 | covered |
| CO-16 | `concepts/secrets` | Secrets | explanation | shared | dev | integrate | What secrets are and how they are scoped (prerequisite of HT-03 chat + CO-12 site-access, so it cannot lag them) | `secret.ts`; `docs.ts` concepts/secret | A | P1 | covered |
| CO-17 | `concepts/extending-a-simulation` | Extending a simulation | explanation | shared | all | iterate | Continuing a finished participant with more steps; the cancel + extend reversible pair (slug kept in parity with the seed to avoid breaking `docs_get` links) | `simulation_extend`; `study-run` extend; `docs.ts` concepts/extending-a-simulation | A | P2 | covered |
| CO-18 | `concepts/benchmarking` | Benchmarks and brand workspaces | explanation | shared | all,evaluator | iterate | What a brand workspace is and how `study benchmark` clones a study across competitors for a head-to-head (MCP-only capability; answers "can I compare us to competitors") | `brands.py`; `studies.py` study_benchmark | A | P1 | gap-now-covered |
| CO-19 | ~~`concepts/your-own-ish`~~ | Your own ish | explanation | shared | all | discover | PULLED FROM v1 (Felix decision 2026-06-15): ish-mcp commit 5b3f98b hid `me` behind `ISH_EXPOSE_ME` (default OFF, "absent from the agent-facing surface"), so the hosted surface is 40 tools with no `me_*`. Page deleted, nav entry removed, and `me` mentions stripped from glossary + cli-and-mcp + server-instructions to match the deployed default. Restore from git if prod enables the flag. | `me.py` (gated by `expose_me`) | A | — | DEFERRED (flag-gated off) |
| CO-20 | `concepts/cli-and-mcp` | The CLI and the MCP server | explanation | shared | all,dev | discover | One backend, two surfaces; the verb to tool-name map; what is MCP-only (`study revise`, `study benchmark`, `me_*`) | `overview-mcp.md` seed (fact-check); `index.ts`; `tools/*` | A | P1 | gap-now-covered |

### TAB: Guides → How-to guides

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HT-01 | `guides/first-study` | Run a study end to end | how-to | cli | human | first | The full happy path from create to reactions | `docs.ts` guides/first-study; `study.ts` | A | P1 | covered |
| HT-02 | `guides/slicing-results` | Slice results | how-to | cli | human,evaluator | slice | Filter by frame/segment/turn/sentiment; group-by | `docs.ts` guides/slicing-results; `study-run` results flags | A | P1 | covered |
| HT-03 | `guides/chat-studies` | Probe a chatbot | how-to | both | dev | iterate | Stand up an `external_chatbot` study against an external endpoint (scoped to the probe mode; rehearsal is HT-10) | `chat.ts`; `chatbots.py`; `docs.ts` guides/chat | A | P1 | covered |
| HT-10 | `guides/chat-pair` | Rehearse a conversation | how-to | both | human,dev | iterate | Stand up a `participant_pair` study: two ish personas converse for a pitch/sales/1:1 rehearsal (asymmetry contract, scenarios) | `chatbots.py`; `studies.py` chat_pair; `ish_mcp/docs/guides/chat-pair.md` (fact-check) | A | P1 | gap-now-covered |
| HT-11 | `guides/getting-media-out` | Get screenshots and media out | how-to | shared | human,dev | slice | List and fetch interactive screenshots + iteration media; the cross-origin auth boundary | `study-screenshots.ts`; MCP `study_media` resources; `docs.ts` reference/screenshots | A | P2 | gap-now-covered |
| HT-12 | `guides/benchmark-competitors` | Run a competitive benchmark | how-to | both | human,evaluator | iterate | The two-step flow: `brand create` each target, then `study benchmark` to clone across them | `brands.py`; `studies.py` study_benchmark | A | P2 | gap-now-covered |
| HT-04 | `guides/build-a-person` | Build a specific person | how-to | both | human | iterate | Generate a person from a brief and sources | `person.ts` generate; `person_generate`; `docs.ts` guides/build-specific-person | A | P1 | covered |
| HT-05 | `guides/local-vs-connect` | Test against localhost | how-to | cli | dev | connect | Disambiguate `ish connect` (cloud fleet → localhost) vs `study run --local` | `connect.ts`; `study-run --local`; `index.ts` connect help | A | P1 | covered |
| HT-06 | `guides/ci-automation` | Use ish in CI | how-to | cli | ci | integrate | Token auth, `--json`/`--get`, exit codes, the dispatch cap, `ISH_ASSUME_YES`, AND a "when a CI run fails" section (reading the error envelope, retry/idempotency) so the ci x troubleshoot need is covered here | `lib/auth.ts`; `output.ts`; `command-helpers` exit codes + error envelope | A | P1 | covered |
| HT-07 | `guides/native-app` | Study a native app | how-to | cli | dev | iterate | iOS/Android runs and the local setup they need | `doctor.ts`; `study-run --platform/--app`; `docs.ts` guides/native-app | A | P2 | covered |
| HT-08 | `guides/cold-start` | Cold start | how-to | cli | human | first | Get moving on a fresh or saturated account | `docs.ts` guides/cold-start | A | P2 | covered |
| HT-09 | `guides/feedback` | Send feedback | how-to | all | all | troubleshoot | Report a bug or request from the CLI | `feedback.ts`; `docs.ts` guides/feedback | A | P2 | covered |

### TAB: Guides → Integrations (the client card grid, ish's highest-leverage surface)

Each client page is the same shape: prerequisites → connect (Steps) → verify → first prompt
to try. Per-client behavior grounded in `client_info.py`.

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| IN-00 | `integrations/index` ★ | Connect your client | how-to | mcp | agent,dev | connect | The card grid: pick a client. States the three client tiers (`ish mcp add` install targets / tailored-hint app-builders / runtime-classified-only) and carries a single "other MCP clients" catch-all naming cline + roo, pointing to MR-02 (no thin per-client pages for those) | `client_info.py`; `mcp-clients.ts` | A | P0 | covered |
| IN-01 | `integrations/claude-code` | Claude Code | how-to | mcp | dev | connect | Connect, verify, first reaction | `client_info.py`; README mcp add; `mcp.ts` | A | P0 | covered |
| IN-02 | `integrations/cursor` | Cursor | how-to | mcp | dev | connect | Connect; note ~30s tool-call cap → prefer `wait=false` | `client_info.py` cursor | A | P0 | covered |
| IN-03 | `integrations/claude-desktop` | Claude Desktop | how-to | mcp | dev | connect | Connect via OAuth | `client_info.py`; README | A | P1 | covered |
| IN-04 | `integrations/chatgpt` | ChatGPT | how-to | mcp | dev | connect | Connect; resource-blind (tools only), no trailing slash on `/mcp` | `client_info.py` chatgpt; `transport.py` | A | P1 | covered |
| IN-05 | `integrations/vscode` | VS Code | how-to | mcp | dev | connect | Connect; dynamic loopback needs OAuthProxy | `client_info.py` vscode; `auth/oauth_proxy.py` | A | P1 | covered |
| IN-06 | `integrations/lovable` | Lovable | how-to | mcp | dev | connect | Connect; share/publish preview URL hints | `client_info.py` lovable | A | P1 | covered |
| IN-07 | `integrations/replit` | Replit | how-to | mcp | dev | connect | Connect; use public webview/Deploy URL | `client_info.py` replit | A | P1 | covered |
| IN-08 | `integrations/bolt` | Bolt | how-to | mcp | dev | connect | Connect; identifies as claude-code, host-based hints | `client_info.py` bolt | A | P2 | covered |
| IN-09 | `integrations/v0` | v0 | how-to | mcp | dev | connect | Connect; deploy to reach previews | `client_info.py` v0 | A | P2 | covered |
| IN-10 | `integrations/windsurf` | Windsurf | how-to | mcp | dev | connect | Connect | `client_info.py` windsurf | A | P2 | covered |

### TAB: CLI Reference → Overview & shared

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CR-01 | `cli/overview` ★ | CLI overview | reference | cli | all | connect | Install matrix, `ish upgrade`, the command index | `install.sh`/`.ps1`; `package.json`; `Formula/ish.rb`; `upgrade.ts` | G+A | P0 | covered |
| CR-02 | `cli/auth` | Authentication | reference | cli | all | connect | Token order, login/logout/status, `~/.ish/config.json`, `ISH_HOME` | `auth.ts`; `lib/auth.ts`; `config.ts` | A | P0 | covered |
| CR-03 | `cli/global-flags` | Global flags | reference | cli | all | reference | Every global flag with defaults | `index.ts:131-143` | G+A | P0 | covered |
| CR-04 | `cli/output-modes` | Output and scripting | reference | cli | ci,dev | integrate | JSON-on-pipe, `--get`, `--fields`, `--human`, chaining | `output.ts`; `command-helpers` computeGlobals | A | P1 | covered |
| CR-05 | `cli/exit-codes` | Exit codes and errors | reference | cli | ci | integrate | Exit codes 0-5 and the structured error envelope | `command-helpers.ts:512-591`; `api-client.ts` | G+A | P1 | covered |
| CR-06 | `cli/env-vars` | Environment variables | reference | cli | dev,ci | reference | All `ISH_*` env vars | grep `ISH_` across `src/` | G+A | P1 | covered |
| CR-07 | `cli/aliases` | Aliases | reference | cli | all | reference | Short id aliases (`w-`, `s-`, `a-`, `i-`, ...) | `alias-store`; `ALIAS_PREFIX` | G+A | P1 | covered |
| CR-08 | `cli/confirmations` | Confirmations and caps | reference | cli | all | integrate | Billable/destructive gates, `-y`, `ISH_ASSUME_YES`, 20-sim cap | `command-helpers` confirmDestructive; `PARTICIPANT_BATCH_CAP` | A | P1 | covered |

### TAB: CLI Reference → Commands (generated; heavy verbs split out)

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CC-00 | `cli/generated/index` ★ | Command index | reference | cli | all | reference | Scannable list of every command | Commander tree | G | P0 | covered |
| CC-01 | `cli/generated/session` | login · logout · status | reference | cli | all | connect | Session commands (whoami alias) | `index.ts` inline | G+A | P0 | covered |
| CC-02 | `cli/generated/study-run` | study run | reference | cli | human | first | The core run verb + poll/wait/cancel/extend | `study-run.ts` | G+A | P0 | covered |
| CC-03 | `cli/generated/study` | study | reference | cli | human | iterate | The study namespace overview (list/get/update/delete/use/generate) | `study.ts` | G+A | P1 | covered |
| CC-04 | `cli/generated/study-create` | study create | reference | cli | human | iterate | The dense per-modality create surface | `study.ts` create | G+A | P1 | at-risk: OVER-DOC |
| CC-05 | `cli/generated/study-results` | study results | reference | cli | human,evaluator | slice | The results read surface + slice flags | `study.ts` results | G+A | P1 | covered |
| CC-06 | `cli/generated/study-extras` | Study sub-verbs: analyze, participant, screenshots, share | reference | cli | human | slice | Study sub-verbs: `analyze`, `insights`, `participant` (create/batch-create/delete), `screenshots` (list default + download), `share`/`unshare` (the `insights` command name appears in the body/command index, not the nav title, to avoid the banned term as prose) | `study-analyze.ts`; `study-participant.ts`; `study-screenshots.ts`; `study-share.ts` | G+A | P1 | covered |
| CC-07 | `cli/generated/ask` | ask | reference | cli | human | iterate | The ask namespace: run, dispatch, retry, add-round, add-questions, add-people, results, wait, list, create, update, archive, unarchive, delete, use (no `ask round` verb; it is `add-round`) | `ask.ts` | G+A | P1 | covered |
| CC-08 | `cli/generated/person` | person | reference | cli | human | iterate | The person namespace: list, create, generate, get, update, delete, suggest-scenarios, evidence (add/list) | `person.ts` | G+A | P1 | covered |
| CC-09 | `cli/generated/iteration` | iteration | reference | cli | human | iterate | The iteration namespace | `iteration.ts` | G+A | P1 | covered |
| CC-10 | `cli/generated/workspace` | workspace · site-access | reference | cli | human,dev | connect | Workspace namespace: list, create, get, update, delete, info, use + the site-access subtree | `workspace.ts` | G+A | P1 | covered |
| CC-11 | `cli/generated/chat` | chat | reference | cli | dev | iterate | chat endpoint + chat config subtrees (generate the dense config flag tables; do not narrate every permutation) | `chat.ts`; `chat-config.ts` | G+A | P1 | at-risk: OVER-DOC |
| CC-12 | `cli/generated/connect` | connect · disconnect | reference | cli | dev | connect | Tunnel commands: `connect` (+ nested `connect status`) and `disconnect` (Commander wiring is inline in `index.ts`; `connect.ts` is the impl) | `index.ts:421-502`; `connect.ts` | G+A | P1 | covered |
| CC-13 | `cli/generated/mcp` | mcp · init | reference | cli | dev | connect | `ish mcp add/list/remove` + `ish init` (install the ish Agent Skill); both wire ish into an agent. Thin generated reference; links MR-02 for the OAuth/connect mechanism rather than restating it | `mcp.ts`; `mcp-clients.ts`; `init.ts` | G+A | P1 | covered |
| CC-14 | `cli/generated/source` | source | reference | cli | human | iterate | source upload/get/delete | `source.ts` | G+A | P2 | covered |
| CC-15 | `cli/generated/secret` | secret | reference | cli | dev | integrate | secret list/set/delete | `secret.ts` | G+A | P2 | covered |
| CC-16 | `cli/generated/config` | config | reference | cli | dev | integrate | simulation config namespace; `config list` requires admin, the run-time override `study run --config` does not | `config.ts` | G+A | P2 | covered |
| CC-17 | `cli/generated/docs` | docs | reference | cli | all | reference | offline in-binary docs commands | `docs.ts` | G+A | P2 | covered |
| CC-19 | `cli/generated/check` | check · setup | reference | cli | dev | troubleshoot | `check` (alias `doctor`) + local-sim `setup` | `doctor.ts` | G+A | P2 | covered |
| CC-20 | `cli/generated/upgrade-feedback` | upgrade · feedback | reference | cli | all | troubleshoot | self-update + feedback (the `upgrade` Commander wiring is inline in `index.ts:521-553`; `upgrade.ts` is the impl) | `index.ts:521-553`; `upgrade.ts`; `feedback.ts` | G+A | P2 | covered |

### TAB: MCP Reference → Overview & connecting

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MR-01 | `mcp/overview` ★ | MCP overview | reference | mcp | agent,dev | connect | What the server is, endpoint `mcp.ishlabs.io/mcp` (no trailing slash), transport. **Sole owner of the endpoint string**; everything else links here | `server.py`; `compose.py`; `fastmcp.json`; `transport.py` | A | P0 | covered |
| MR-02 | `mcp/connecting` | Connecting | how-to | mcp | dev | connect | **Single canonical owner of the "add the server" mechanism**: both add paths (`claude mcp add` / `ish mcp add`) + OAuth on first connect. MR-01/MR-04, CC-13, and every IN-* link here and do not restate it | README (primary); `ish-cli` `mcp-clients.ts`; `docs/guides/mcp-add.md` (fact-check only) | A | P0 | covered |
| MR-03 | `mcp/tool-conventions` | Tool conventions | reference | mcp | agent,dev | reference | `noun_verb`, polymorphic `_get`, annotation tiers, alias-or-UUID ids (links the shared alias definition, does not redefine it) | ADR-0001; `tool_annotations.py`; `aliases.py` | A | P0 | covered |
| MR-04 | `mcp/auth` | Authentication | reference | mcp | dev | connect | OAuth/jwt modes, OAuthProxy, token forwarding (links MR-02 for the add flow) | `auth/*.py` | A | P1 | covered |
| MR-05 | `mcp/server-instructions` | Server instructions | explanation | mcp | agent,dev | discover | The instructions block the server sends, explained | `server.py` INSTRUCTIONS | A | P1 | covered |
| MR-06 | `mcp/errors` | Errors | reference | mcp | agent,dev | troubleshoot | The error vocabulary only (long-running polling moved to MR-07 to keep one Diataxis subject per page) | tool errors; bracketed error prefixes | A | P1 | covered |
| MR-07 | `mcp/long-running-jobs` | Long-running calls | reference | mcp | agent,dev | reference | The `wait`/`timeout` contract, `next_action`, and why the server does not push completion (the core agent-loop contract, split out of MR-06) | `tool_annotations` LONG_RUNNING; `ish_mcp/docs/reference/long-running-jobs.md` (fact-check) | A | P1 | gap-now-covered |

### TAB: MCP Reference → Tools (generated, one page per domain tag) + Resources

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MT-00 | `mcp/generated/index` ★ | Tool index | reference | mcp | agent,dev | reference | Every tool grouped by tag with its annotation tier | `list_tools()` | G | P0 | covered |
| MT-01 | `mcp/generated/tools-study` | Study tools | reference | mcp | agent,dev | reference | `study_*` (9 tools) param schemas; `study_create`/`study_add_iteration` carry the per-modality explosion, so generate tables and link CO-05 for modality meaning, never re-narrate | `studies.py` | G+A | P0 | at-risk: OVER-DOC |
| MT-02 | `mcp/generated/tools-ask` | Ask tools | reference | mcp | agent,dev | reference | `ask_*` (6 tools) | `asks.py` | G+A | P1 | covered |
| MT-03 | `mcp/generated/tools-person` | Person tools | reference | mcp | agent,dev | reference | `person_*` + `source_upload` | `people.py` | G+A | P1 | covered |
| MT-04 | `mcp/generated/tools-workspace` | Workspace tools | reference | mcp | agent,dev | reference | `workspace_*` | `workspaces.py` | G+A | P1 | covered |
| MT-05 | `mcp/generated/tools-chatbot` | Chatbot tools | reference | mcp | agent,dev | reference | `chatbot_*` (5 tools) | `chatbots.py` | G+A | P1 | covered |
| MT-06 | `mcp/generated/tools-simulation` | Simulation tools | reference | mcp | agent,dev | reference | `simulation_cancel/extend` | `simulations.py` | G+A | P1 | covered |
| MT-07 | `mcp/generated/tools-site-access` | Site-access tools | reference | mcp | agent,dev | reference | `site_access_*` | `site_access.py` | G+A | P1 | covered |
| MT-08 | `mcp/generated/tools-connect` | Connect tools | reference | mcp | agent,dev | reference | `connect`, `connect_status` | `connect.py` | G+A | P2 | covered |
| MT-09 | `mcp/generated/tools-upload` | Upload tools | reference | mcp | agent,dev | reference | `upload_create/status` (hosted file relay) | `uploads.py` | G+A | P2 | covered |
| MT-10 | `mcp/generated/tools-me` | Me tools | reference | mcp | agent,dev | reference | `me_ask`, `me_get` | `me.py` | G+A | P2 | covered |
| MT-11 | `mcp/generated/tools-brand` | Brand tools | reference | mcp | agent,dev | reference | `brand_*` (benchmark workspaces) | `brands.py` | G+A | P2 | covered |
| MT-12 | `mcp/generated/tools-docs` | Docs tool | reference | mcp | agent,dev | reference | `docs_get` (resource mirror for resource-blind clients) | `docs.py` | G+A | P2 | covered |
| MT-13 | `mcp/generated/resources` | Resources | reference | mcp | agent,dev | reference | Enumerates every `ish://` resource (10, incl. `reference/content-types/{modality}`) + URI templates, from `list_resources()` + `list_resource_templates()` | `resources/*.py` | G+A | P1 | covered |

### TAB: Help (own top tab; troubleshoot is the highest-stress journey and deserves a surface-neutral home)

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HP-01 | `help/troubleshooting` | Troubleshooting | how-to | shared | all | troubleshoot | Symptom → cause → fix (auth, tunnel, gated preview, OAuth loopback) | errors; `doctor.ts`; pitfalls | A | P1 | covered |
| HP-02 | `help/errors` | Error reference | reference | shared | all | troubleshoot | The error-code table (CLI envelope + MCP vocabulary) | `api-client` mapErrorCode; MCP errors | G+A | P1 | covered |
| HP-03 | `help/glossary` | Glossary | reference | shared | all | reference | One-line definitions linking to concept pages | concepts/* | A | P1 | covered |
| HP-04 | `help/pitfalls` | Pitfalls | explanation | shared | all | troubleshoot | The known gotchas, re-verified | `docs.ts` reference/pitfalls | A | P2 | covered |

### TAB: Changelog

| id | page_path | title | mode | surface | audience | journey | job | sources | gen | prio | verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CH-01 | `changelog/overview` | Changelog | reference | shared | all | reference | Dated entries, CLI + MCP versions | release notes; git history | A | P1 | covered |

### Machine surface (config only)

| id | path | what | gen | prio | verdict |
|---|---|---|---|---|---|
| LL-01 | `/llms.txt`, `/llms-full.txt` | Mintlify auto-generated agent index | G (Mintlify) | P0 | covered (config) |

---

## 4. Coverage analysis

**Verified by 4 independent audit agents** (re-deriving CLI commands, MCP tools/resources,
concept space, and IA from source). Their findings are folded in above: 6 new rows added
(CO-18 benchmarking, CO-19 your-own-ish, CO-20 cli-and-mcp, HT-10 chat-pair, HT-11 media-out,
HT-12 benchmark, MR-07 long-running-jobs), CC-18 init merged into CC-13, Help promoted to its
own tab, CO-16 secrets promoted P2→P1, and dedup ownership assigned for the endpoint string
(MR-01) and the add mechanism (MR-02).

**Tabs (5):** Guides · CLI Reference · MCP Reference · Help · Changelog.

**Totals:** ~99 pages. P0 ≈ 24 · P1 ≈ 54 · P2 ≈ 21.
By gen: authored ≈ 60, G+A ≈ 37, G ≈ 2.
By surface: shared ≈ 31, cli ≈ 36, mcp ≈ 32.

**Cross-product collapse:** the nominal 6×4×4×8 = 768 cells collapse to the ~95 real pages
above. The bulk of `n/a` cells are `evaluator × {reference,tutorial}` (evaluators read
explanation + the integrations grid, not command tables) and `agent × tutorial` (the agent
reads tool schemas + conventions, the dev reads the tutorial).

**Deliberate non-goals (documented, not gaps):**
- No API reference (`api.ishlabs.io`) — out of scope; the public surface is CLI + MCP. Backend
  also disables `openapi.json` in prod.
- No web-app/product docs — out of scope.
- MCP has 0 prompts — nothing to document there (stated, so absence is not a gap).

**At-risk cells and the mitigation:**
- `CC-04 study create` and `MT-01 study_create/study_add_iteration` → **OVER-DOC**. Generate the
  flag/param tables; author only intro + when-to-use + one example; link CO-05 for modality
  meaning; never narrate every per-modality permutation. CC-11 chat (config subtree) same class.
- The "add the server" flow across `MR-02`, `IN-*`, `CC-13`, `MR-01`, `MR-04` →
  **DUPLICATE-TRUTH**. Mitigation: MR-01 sole-owns the endpoint string; MR-02 sole-owns the add
  mechanism + OAuth; everything else links them. Each `integrations/*` is client-specific Steps +
  verify only.
- Alias semantics across `CR-07` (CLI) and `MR-03` (MCP) → **DUPLICATE-TRUTH**. Define "what an
  alias is" once (CR-07 for the CLI prefix table; MR-03 links it and adds the MCP alias-or-UUID
  rule); the glossary cross-links both.
- All `*/generated/**` reference → **STALE-SEED** risk if hand-edited. Mitigation: generators own
  them; verifier CI fails on drift.
- Every page → **VOICE-VIOLATION** risk (em-dash, `insights`, `tester`). Mitigation: the regex
  linter gate + the independent reviewer voice pass. CC-06 specifically keeps `insights` out of
  the nav title (command name appears in body only).

**Resolved during verification (was open):**
- **Nav:** Help is now its own top tab (5 tabs). Troubleshoot is the highest-stress journey and a
  cross-surface reference cluster should not hide inside a task-oriented Guides tab.
- **Concept splits:** `people`, `modalities`, `credits-and-limits` stay split; added `benchmarking`,
  `your-own-ish`, `cli-and-mcp` (real capabilities that had only tool-schema coverage).
- **Routing totality:** the two real uncovered needs found (ci × troubleshoot; benchmarking with no
  human/evaluator path) are now closed (HT-06 failure section; CO-18/HT-12).

**Open questions for Felix (review):**
1. **Ambition for v1.** ~99 pages total. Ship all priorities, or hold P2 (~21 pages) for a second
   pass and launch on P0+P1 (~78)?
2. **Client roster.** P0 = Claude Code + Cursor; P1 adds Claude Desktop, ChatGPT, VS Code, Lovable,
   Replit; P2 adds Bolt, v0, Windsurf; cline + roo are a catch-all note, not pages. Reprioritize any?
3. **Benchmarking + your-own-ish** are MCP-only capabilities I promoted to P1 concept pages. Are
   these v1 stories, or defer to P2?
4. **Changelog** as a hand-maintained page now, or defer until there is a release cadence to mirror?
