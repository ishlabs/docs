#!/usr/bin/env node
// Voice linter for ish docs (content-style.md). Strips frontmatter, MDX comments,
// fenced code, and inline code, then flags banned glyphs/terms in the remaining
// prose. Exit 1 on any violation. Used as a quality gate by reviewers + CI.
//
// Usage: node .planning/lint-voice.mjs <root-or-files...>   (default: docs root)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url))); // docs repo root
const args = process.argv.slice(2);
const targets = args.length ? args : [root];

// Banned glyphs (always, even in code we still flag em/en dashes everywhere).
const GLYPHS = [
  [/[—]/g, "em dash (use period, comma, colon, semicolon, or parentheses)"],
  [/[–]/g, "en dash (use a hyphen for ranges, or rephrase)"],
];
// Banned terms in PROSE (after stripping code). Word-boundary, case-insensitive.
const TERMS = [
  [/\binsights\b/gi, '"insights" as output noun (use findings/reactions; wrap a literal command name in backticks)'],
  [/\btesters?\b/gi, '"tester" in prose (use simulated person/people/participant; backtick identifiers)'],
  [/\bAI-powered\b/gi, '"AI-powered" puffery'],
  [/\bpowered by AI\b/gi, '"powered by AI" puffery'],
  [/\bcutting-edge\b/gi, "puffery"],
  [/\brevolutionary\b/gi, "puffery"],
  [/\breimagined\b/gi, "puffery"],
  [/\bnext-generation\b/gi, "puffery"],
  [/\bworld-class\b/gi, "puffery"],
  [/\bbest-in-class\b/gi, "puffery"],
  [/\bat scale\b/gi, "puffery"],
  [/\bend-to-end\b/gi, "puffery"],
  [/\bempower\b/gi, "vague verb"],
  [/\bunlock\b/gi, "vague verb"],
  [/\bleverage\b/gi, "vague verb"],
];

function collectMdx(p) {
  const out = [];
  const st = statSync(p);
  if (st.isDirectory()) {
    if (/node_modules|\.git|\.planning/.test(p)) return out;
    for (const e of readdirSync(p)) out.push(...collectMdx(join(p, e)));
  } else if (extname(p) === ".mdx") {
    out.push(p);
  }
  return out;
}

// Return prose with code/comments/frontmatter removed but line count preserved.
function strip(src) {
  let s = src;
  s = s.replace(/^---[\s\S]*?\n---/, (m) => m.replace(/[^\n]/g, " ")); // frontmatter
  s = s.replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " ")); // mdx comments
  s = s.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " ")); // fenced code
  s = s.replace(/`[^`\n]*`/g, (m) => " ".repeat(m.length)); // inline code
  return s;
}

const files = targets.flatMap(collectMdx);
const violations = [];
for (const f of files) {
  const raw = readFileSync(f, "utf8");
  // glyphs: check raw (banned even in code)
  const rawLines = raw.split("\n");
  const proseLines = strip(raw).split("\n");
  rawLines.forEach((line, i) => {
    for (const [re, why] of GLYPHS) {
      if (re.test(line)) violations.push(`${f}:${i + 1}  ${why}`);
      re.lastIndex = 0;
    }
  });
  // Term checks (insights/tester/puffery) are an AUTHORED-prose gate. Generated
  // reference faithfully mirrors engineer-written source (the literal `insights`
  // command, the old `tester` noun, etc.), so it is exempt from term checks.
  // Glyph checks (dashes) still apply everywhere and are normalized at generation.
  const isGenerated = /\/(cli|mcp)\/generated\//.test(f);
  if (!isGenerated) {
    proseLines.forEach((line, i) => {
      for (const [re, why] of TERMS) {
        const m = line.match(re);
        if (m) violations.push(`${f}:${i + 1}  ${why}  ("${m[0]}")`);
        re.lastIndex = 0;
      }
    });
  }
}

if (violations.length) {
  console.error(`Voice linter: ${violations.length} violation(s) across ${files.length} file(s):`);
  for (const v of violations) console.error("  " + v);
  process.exit(1);
}
console.log(`Voice linter: clean across ${files.length} file(s).`);
