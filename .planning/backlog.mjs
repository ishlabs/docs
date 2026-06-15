#!/usr/bin/env node
// Extract the authored P0+P1 backlog from the coverage matrix as JSON.
// Authored = not a pure-generated reference page (cli/generated|mcp/generated),
// priority P0 or P1, changelog deferred.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(join(here, "docs-coverage-matrix.md"), "utf8");
const ID_RE = /^[A-Z]{2}-\d+$/;
const rows = [];
for (const line of md.split("\n")) {
  if (!line.startsWith("|")) continue;
  const c = line.split("|").slice(1, -1).map((s) => s.trim());
  if (c.length < 12 || !ID_RE.test(c[0])) continue;
  const [id, page_path, title, mode, surface, audience, journey, job, sources, gen, prio] = c;
  rows.push({ id, page_path, title, mode, surface, audience, journey, job, sources, gen, prio });
}
const clean = (s) => s.replace(/`/g, "").replace(/\*\*/g, "").replace(/★/g, "").trim();
const backlog = rows
  .map((r) => ({ ...r, page_path: clean(r.page_path) }))
  .filter((r) => !/^(cli|mcp)\/generated\//.test(r.page_path))
  .filter((r) => r.prio === "P0" || r.prio === "P1")
  .filter((r) => r.id !== "CH-01")
  .map((r) => ({
    id: r.id,
    path: clean(r.page_path),
    title: clean(r.title),
    mode: r.mode,
    surface: r.surface,
    audience: r.audience,
    job: clean(r.job),
    sources: clean(r.sources),
    prio: r.prio,
  }));
console.log(JSON.stringify(backlog, null, 0));
