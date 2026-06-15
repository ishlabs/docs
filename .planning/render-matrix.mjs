#!/usr/bin/env node
// Render the canonical docs-coverage-matrix.md into a read-only filterable HTML view.
// Markdown is canonical; this is a generated review artifact. Not published (.mintignore).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const md = readFileSync(join(here, "docs-coverage-matrix.md"), "utf8");

// --- parse ---------------------------------------------------------------
const ID_RE = /^[A-Z]{2}-\d+$/;
const lines = md.split("\n");
let tab = "",
  group = "";
const rows = [];
for (const line of lines) {
  const h = line.match(/^###\s+TAB:\s*(.+?)\s*$/);
  if (h) {
    const full = h[1].replace(/\(.*$/, "").trim();
    const parts = full.split("→").map((s) => s.trim());
    tab = parts[0];
    group = parts[1] || "";
    continue;
  }
  if (!line.startsWith("|")) continue;
  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.length < 12) continue;
  if (!ID_RE.test(cells[0])) continue;
  const [id, page_path, title, mode, surface, audience, journey, job, sources, gen, prio, verdict] = cells;
  rows.push({ id, tab, group, page_path, title, mode, surface, audience, journey, job, sources, gen, prio, verdict });
}

// --- helpers -------------------------------------------------------------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const code = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>");
const prioClass = (p) => (p === "P0" ? "high" : p === "P1" ? "med" : "low");
const genClass = (g) => (g === "A" ? "accent" : g === "G" ? "info" : "neutral");
const verdictClass = (v) => (v.startsWith("at-risk") ? "med" : v.startsWith("gap") ? "info" : "ok");
const uniq = (key) => [...new Set(rows.map((r) => r[key]))].filter(Boolean);

const count = (p) => rows.filter((r) => r.prio === p).length;
const tabs = uniq("tab");
const modes = uniq("mode");
const surfaces = uniq("surface");

const rowHtml = (r) => `
  <tr data-tab="${esc(r.tab)}" data-prio="${r.prio}" data-mode="${r.mode}" data-surface="${r.surface}" data-gen="${r.gen}"
      data-search="${esc((r.id + " " + r.page_path + " " + r.title + " " + r.job + " " + r.sources).toLowerCase())}">
    <td><span class="chip id">${esc(r.id)}</span></td>
    <td><code>${esc(r.page_path)}</code><br><span class="small">${esc(r.title)}</span></td>
    <td><span class="chip neutral">${esc(r.mode)}</span></td>
    <td>${esc(r.surface)}</td>
    <td class="small">${esc(r.tab)}${r.group ? " · " + esc(r.group) : ""}</td>
    <td class="small">${code(r.job)}</td>
    <td><span class="chip ${genClass(r.gen)}">${esc(r.gen)}</span></td>
    <td><span class="chip ${prioClass(r.prio)}">${esc(r.prio)}</span></td>
    <td><span class="chip ${verdictClass(r.verdict)}">${esc(r.verdict)}</span></td>
  </tr>`;

const btn = (group, val, label) =>
  `<button class="btn flt" data-group="${group}" data-val="${esc(val)}">${esc(label || val)}</button>`;

// --- canonical style (verbatim from ~/.claude/docs/html-artifacts.md) ----
const STYLE = `:root{color-scheme:light dark;--paper:#fdfcf9;--surface:#f8f6f1;--surface-sunken:#f2efe8;--ink:#262219;--ink-muted:#6a6458;--ink-faint:#8c8678;--line:#d6cfc0;--line-soft:#e6e0d4;--accent:#a94c1b;--accent-soft:#f5e6da;--link:#a94c1b;--sev-high:#bb3b28;--sev-high-bg:#f7e4e0;--sev-med:#8d5a08;--sev-med-bg:#f5ebd6;--sev-low:#6a6458;--sev-low-bg:#eceae3;--ok:#1a6e3c;--ok-bg:#e1f0e6;--info:#2f6aa8;--info-bg:#e3ecf5;--code-bg:#f2efe8;--shadow:0 1px 3px rgba(40,34,20,.06),0 8px 24px rgba(40,34,20,.05);--font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;--font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--font-serif:"Source Serif 4","Iowan Old Style",Palatino,Georgia,serif;}
@media (prefers-color-scheme:dark){:root{--paper:#1a1916;--surface:#232220;--surface-sunken:#2a2825;--ink:#ece8df;--ink-muted:#a39d90;--ink-faint:#857f72;--line:#43403a;--line-soft:#35332e;--accent:#e08a4f;--accent-soft:#3a2a1d;--link:#e08a4f;--sev-high:#f2746a;--sev-high-bg:#3a1f1b;--sev-med:#e0a94a;--sev-med-bg:#352b16;--sev-low:#9a9488;--sev-low-bg:#2c2a26;--ok:#5bc47e;--ok-bg:#16301f;--info:#7aa6dd;--info-bg:#1c2838;--code-bg:#2a2825;--shadow:none;}}
*{box-sizing:border-box}
body{font:15px/1.55 var(--font-sans);color:var(--ink);background:var(--paper);max-width:1240px;margin:0 auto;padding:2rem 1.1rem 5rem;-webkit-font-smoothing:antialiased}
h1{font:600 1.85rem/1.18 var(--font-serif);letter-spacing:-.01em;margin:.2rem 0 .4rem;color:var(--ink)}
h2{font:600 1.3rem/1.22 var(--font-serif);margin:2rem 0 .8rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--ink)}
p{margin:.6rem 0}small,.small{font-size:.82rem;color:var(--ink-muted)}
code{font-family:var(--font-mono);font-size:.86em;background:var(--code-bg);padding:.06em .35em;border-radius:4px}
.page-header{border-bottom:1px solid var(--line);padding-bottom:1.1rem;margin-bottom:1.2rem}
.page-header .lede{font-size:1.05rem;color:var(--ink-muted);max-width:70ch;margin:.3rem 0 .6rem}
.page-header .meta{font:.8rem/1.5 var(--font-mono);color:var(--ink-faint)}
.chip{display:inline-block;font:700 .72rem/1.45 var(--font-sans);padding:.05rem .5rem;border-radius:6px;background:var(--surface-sunken);color:var(--ink-muted);border:1px solid transparent}
.chip.high{background:var(--sev-high-bg);color:var(--sev-high)}.chip.med{background:var(--sev-med-bg);color:var(--sev-med)}.chip.low{background:var(--sev-low-bg);color:var(--sev-low)}.chip.ok{background:var(--ok-bg);color:var(--ok)}.chip.info{background:var(--info-bg);color:var(--info)}.chip.accent{background:var(--accent-soft);color:var(--accent)}.chip.neutral{background:var(--surface-sunken);color:var(--ink-muted)}
.chip.id{font-family:var(--font-mono);font-weight:600;border-radius:999px}
.kpi{display:flex;flex-wrap:wrap;gap:.6rem;margin:1rem 0}
.kpi-card{min-width:90px;flex:1 1 90px;border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:.6rem .8rem}
.kpi-card .n{font:700 1.5rem/1 var(--font-mono);color:var(--ink)}
.kpi-card .l{display:block;margin-top:.25rem;font:700 .7rem/1.2 var(--font-mono);letter-spacing:.05em;text-transform:uppercase;color:var(--ink-muted)}
.kpi-card.high .n{color:var(--sev-high)}.kpi-card.med .n{color:var(--sev-med)}.kpi-card.low .n{color:var(--sev-low)}.kpi-card.ok .n{color:var(--ok)}.kpi-card.info .n{color:var(--info)}
.btn{font:inherit;font-size:.82rem;padding:.3rem .7rem;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);cursor:pointer}
.btn:hover{border-color:var(--accent)}
.btn.on{border-color:var(--accent);background:var(--accent);color:var(--paper)}
.controls{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--paper) 88%,transparent);backdrop-filter:blur(8px);padding:.7rem 0;margin:0 0 1rem;border-bottom:1px solid var(--line)}
.controls .grp{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;margin:.3rem 0}
.controls .lbl{font:700 .66rem/1 var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted);width:5rem}
#q{font:inherit;padding:.35rem .7rem;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);min-width:16rem}
.scroll{overflow:auto;border:1px solid var(--line);border-radius:10px;margin:1rem 0;max-height:78vh}
table{border-collapse:collapse;width:100%;font-size:.84rem;margin:0}
th,td{border:1px solid var(--line-soft);padding:.45rem .6rem;text-align:left;vertical-align:top}
thead th{position:sticky;top:0;z-index:2;background:var(--surface-sunken);font:700 .68rem/1.3 var(--font-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--ink-muted)}
tbody tr:nth-child(even){background:color-mix(in srgb,var(--line-soft) 32%,transparent)}
tbody tr.hide{display:none}
footer{margin-top:3rem;padding-top:1rem;border-top:1px solid var(--line);font-size:.82rem;color:var(--ink-muted)}
footer .mono{font-family:var(--font-mono)}`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ish docs — coverage matrix</title>
<style>${STYLE}</style></head><body>
<header class="page-header">
  <h1>ish docs — documentation coverage matrix</h1>
  <p class="lede">The full map of the docs content space for the ish CLI + MCP docs site. Every row is one writer + reviewer work order, grounded to a real source file. Adapted from the coverage-matrix skill, then verified by four independent audit agents against source.</p>
  <p class="meta">${rows.length} pages · 5 tabs · canonical source: docs/.planning/docs-coverage-matrix.md</p>
</header>

<div class="kpi">
  <div class="kpi-card"><span class="n">${rows.length}</span><span class="l">pages</span></div>
  <div class="kpi-card high"><span class="n">${count("P0")}</span><span class="l">P0</span></div>
  <div class="kpi-card med"><span class="n">${count("P1")}</span><span class="l">P1</span></div>
  <div class="kpi-card low"><span class="n">${count("P2")}</span><span class="l">P2</span></div>
  <div class="kpi-card accent"><span class="n">${rows.filter((r) => r.gen === "A").length}</span><span class="l">authored</span></div>
  <div class="kpi-card info"><span class="n">${rows.filter((r) => r.gen !== "A").length}</span><span class="l">generated</span></div>
  <div class="kpi-card"><span class="n">${rows.filter((r) => r.verdict.includes("at-risk")).length}</span><span class="l">at-risk</span></div>
</div>

<div class="controls">
  <div class="grp"><span class="lbl">Search</span><input id="q" placeholder="filter by id, path, title, job, source..."></div>
  <div class="grp"><span class="lbl">Priority</span>${["P0", "P1", "P2"].map((p) => btn("prio", p)).join("")}</div>
  <div class="grp"><span class="lbl">Tab</span>${tabs.map((t) => btn("tab", t)).join("")}</div>
  <div class="grp"><span class="lbl">Mode</span>${modes.map((m) => btn("mode", m)).join("")}</div>
  <div class="grp"><span class="lbl">Surface</span>${surfaces.map((s) => btn("surface", s)).join("")}</div>
  <div class="grp"><button class="btn" id="clear">Clear filters</button> <span class="small" id="shown"></span></div>
</div>

<div class="scroll"><table>
<thead><tr><th>ID</th><th>Page / title</th><th>Mode</th><th>Surface</th><th>Tab · group</th><th>Job</th><th>Gen</th><th>Prio</th><th>Verdict</th></tr></thead>
<tbody>${rows.map(rowHtml).join("")}</tbody>
</table></div>

<footer><span class="mono">Generated from docs-coverage-matrix.md. Verdict legend: <span class="chip ok">covered</span> <span class="chip info">gap-now-covered</span> <span class="chip med">at-risk</span>. Gen: <span class="chip accent">A authored</span> <span class="chip info">G generated</span> <span class="chip neutral">G+A</span>.</span></footer>

<script>
const f={};
const trs=[...document.querySelectorAll('tbody tr')];
const shown=document.getElementById('shown');
function apply(){
  const q=(document.getElementById('q').value||'').toLowerCase().trim();
  let n=0;
  for(const tr of trs){
    let ok=true;
    for(const g of Object.keys(f)){ if(f[g] && tr.dataset[g]!==f[g]) ok=false; }
    if(ok && q && !tr.dataset.search.includes(q)) ok=false;
    tr.classList.toggle('hide',!ok); if(ok)n++;
  }
  shown.textContent=n+' / '+trs.length+' shown';
}
document.querySelectorAll('.flt').forEach(b=>b.onclick=()=>{
  const g=b.dataset.group, v=b.dataset.val;
  if(f[g]===v){ delete f[g]; b.classList.remove('on'); }
  else { f[g]=v; document.querySelectorAll('.flt[data-group="'+g+'"]').forEach(x=>x.classList.remove('on')); b.classList.add('on'); }
  apply();
});
document.getElementById('q').oninput=apply;
document.getElementById('clear').onclick=()=>{for(const k of Object.keys(f))delete f[k];document.querySelectorAll('.flt').forEach(x=>x.classList.remove('on'));document.getElementById('q').value='';apply();};
apply();
</script>
</body></html>`;

const out = process.env.OUT || join(process.env.HOME, ".claude", "artifacts", "ish-docs-coverage-matrix.html");
writeFileSync(out, html);
console.log(`Rendered ${rows.length} rows -> ${out}`);
