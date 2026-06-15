# ish documentation: authoring contract

This file is binding for anyone (human or agent) writing or editing pages in this
repo. It encodes the ish voice, terminology, and structure rules. The canonical
voice source is `ish-frontend/.docs/content-style.md`; this is the docs-scoped
extract plus docs-only rules.

## About this project

- Public documentation for **two developer products**: the `ish` **CLI**
  (`@ishlabs/cli`) and the `ish` **MCP server** (`mcp.ishlabs.io`). Plus a shared
  concepts core both depend on.
- ish is a simulated human experience engine. Simulated people experience the thing
  you are making (a link, a Figma prototype, an ad, a video, a PDF, a chatbot) and
  report back what they noticed, where they got stuck, and what they would do next,
  **before it ships**. The output is a reported journey (sentiment, friction,
  blockers, positive moments, completion) with the reasoning behind it, not a score.
- Built on [Mintlify](https://mintlify.com). Pages are MDX with YAML frontmatter.
  Config is `docs.json`. Deployed at `docs.ishlabs.io` (also reachable at
  `ishlabs.io/docs`).

## Source of truth (grounding rule, non-negotiable)

Every factual claim about a command, flag, tool, parameter, resource, endpoint, exit
code, or env var MUST be verified against current code, not prose:

- CLI: `ish-cli/src/index.ts` (+ `src/commands/*`), `src/lib/docs.ts`, `src/lib/enums.ts`.
- MCP: `ish-mcp/src/ish_mcp/tools/*.py`, `resources/*.py`, `compose.py`, `models/*.py`.

The existing in-tool docs (`ish-cli/src/lib/docs.ts`, `ish-mcp/src/ish_mcp/docs/`) and
the repo READMEs are **drafts to fact-check, never to copy**. They have already drifted
from the code (the MCP README says "30 tools"; the registry has 43). When in doubt, the
code wins.

## Generated files (do not hand-edit)

`cli/generated/**` and `mcp/generated/**` are produced by generators in the source repos
and carry a "GENERATED FILE" banner. Never edit them by hand. To change them, change the
source and regenerate. Hand-author only the intros/when-to-use/examples in the
non-generated reference pages.

## Terminology (use exactly these)

| Use | Not | Why |
|---|---|---|
| `workspace` | `product`, `project` | The agent-facing name (backend calls it "product"). |
| `study` | `test`, `project` | The persistent research artifact. |
| `iteration` | `version`, `variant` | One configured run of a study. |
| `simulated person`, `people`, `audience`, `participant`, or the role noun (`reader`, `viewer`, `listener`, `buyer`, `visitor`) | `tester`, `user-tester` | `tester` is category language and is the old domain noun; the CLI/MCP surface is `person`/`participant`. |
| `findings`, `reactions`, `what they noticed / missed / felt` | `insights` (as the output noun) | ish is narrative, not a scoring tool. |
| `Simulate a visit` (in-product action), `Get ish free` (signup CTA) | `Run a test`, `Try for free` | Names the product, not the category. |
| `under five minutes` | `in minutes`, `under two minutes` | One committed number. |

**Identifier exceptions.** When a command, field, or value is literally named, document
it by its real name in `code` formatting even if the word is otherwise discouraged: the
`ish study insights` command and the MCP `KeyInsight` field are literal identifiers (use
the code literal, but describe the *output* as findings/reactions in prose); CLI aliases
like `pt-` and backend types are identifiers, not prose.

## Voice (always)

- **Imperative, concrete, short.** `Install the CLI.` Not `You can install the CLI`.
- **Lowercase `ish`** in prose (capitalize only at sentence start).
- **Narrative-led**, honest about simulation. Never overclaim that output is a real human.
- The `ish` hedge attaches ONLY to the simulated entity (`your audience, ish.`), NEVER to
  the record of a run (findings, results, transcripts) or to errors/auth/billing. In
  reference docs, mostly skip the hedge; it is a marketing beat, not a reference one.

## Banned outright (reviewer fails the page on any of these)

- **Em / en dashes** (`—`, `–`). Use period, comma, colon, semicolon, or parentheses.
- **Puffery**: cutting-edge, revolutionary, reimagined, next-generation, world-class,
  best-in-class, at scale, end-to-end solution.
- **Vague verbs** as filler: empower, unlock, leverage, enable.
- **Category hype**: AI-powered, powered by AI.
- **"insights"** as the output noun (the command name is an identifier exception).
- **"tester"** in prose (identifier/alias exception only).
- **`ish` as a noun for a person** (`an ish`, `meet an ish`).

## Mechanics

- Sentence case for headings, buttons, table headers. Not Title Case.
- Numbers: spell out zero to nine; numerals for 10+; always numerals for time/size
  (`5 min`, `20 MB`).
- Contractions OK. Oxford comma when it prevents ambiguity. No trailing punctuation on
  headings/labels; sentences in callouts/errors end in a period.
- Code formatting for commands, flags, file names, paths, tool names, env vars.

## Diataxis discipline (one mode per page, stamped in frontmatter)

Add `mode:` to frontmatter: `tutorial`, `how-to`, `reference`, or `explanation`. Never
mix modes on a page.

- **tutorial** — one happy path; the reader succeeds. No option-dumping, no "why".
- **how-to** — goal-oriented steps for a competent reader. Assume concepts; link them.
- **reference** — dry, complete, scannable. Tables / `ParamField`. No narrative.
- **explanation** — the mental model and the "why". No step lists.

Define each shared concept ONCE in `concepts/` and link to it. Never re-define a concept
inside a CLI or MCP page.

## Components (Mintlify, no import needed in MDX)

`<Tabs>`/`<Tab>`, `<CodeGroup>`, `<Columns>`+`<Card>` (the client grid), `<Steps>`/`<Step>`,
`<Accordion>`/`<AccordionGroup>`, `<Note>`/`<Tip>`/`<Info>`/`<Warning>`/`<Check>`/`<Danger>`,
`<Frame>` (screenshots), `<ParamField>`/`<ResponseField>`/`<Expandable>` (reference). Use
`<CodeGroup>` to show CLI-and-MCP parity on one page rather than two pages.

## Mintlify tooling

- Preview locally: `mint dev` (run where `docs.json` is). Check links: `mint broken-links`.
- For Mintlify product knowledge, the docs MCP is `https://www.mintlify.com/docs/mcp`.
