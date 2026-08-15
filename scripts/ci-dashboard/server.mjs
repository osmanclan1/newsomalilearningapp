// Live verification server for cicd-diagnosis-map_1.html, scoped to this project.
//
// Serves the dashboard at GET / and runs the actual local checks on GET /api/run
// (Server-Sent Events — each check's real pass/fail streams to the browser as it
// finishes). Nothing here is pre-run or faked; every result comes from actually
// invoking npm/docker on this machine, triggered by a click in the browser.
//
// Run:  node scripts/ci-dashboard/server.mjs
// Then open the printed URL.

import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DASHBOARD_PORT = 5199;
const CONTAINER_PORT = 8199;
const IMAGE_TAG = "hadal:dashboard-check";
const CONTAINER_NAME = "hadal-dashboard-check";

let running = false;

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(cmd, args, { cwd: opts.cwd || ROOT });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => {
      resolve({ ok: code === 0, output: out.trim().slice(-4000), durationMs: Date.now() - start });
    });
    child.on("error", (err) => {
      resolve({ ok: false, output: String(err), durationMs: Date.now() - start });
    });
  });
}

async function checkWorkflowFile() {
  const start = Date.now();
  const p = path.join(ROOT, ".github", "workflows", "ci.yml");
  try {
    const text = await readFile(p, "utf8");
    const hasJobs = /^jobs:/m.test(text);
    const hasRunsOn = /runs-on:/.test(text);
    const pinnedActions = [...text.matchAll(/uses:\s*[\w-]+\/[\w-]+@([0-9a-f]{40}|[\w.-]+)/g)];
    const unpinned = pinnedActions.filter((m) => !/^[0-9a-f]{40}$/.test(m[1]));
    const ok = hasJobs && hasRunsOn && unpinned.length === 0;
    const lines = [
      `jobs: key present — ${hasJobs}`,
      `runs-on present — ${hasRunsOn}`,
      `${pinnedActions.length} action reference(s) found, ${unpinned.length} not SHA-pinned`,
      ...unpinned.map((m) => `  not pinned: ${m[0]}`),
    ];
    return { ok, output: lines.join("\n"), durationMs: Date.now() - start };
  } catch (err) {
    return { ok: false, output: `Could not read ${p}: ${err.message}`, durationMs: Date.now() - start };
  }
}

async function checkNodeVersion() {
  const v = process.version;
  return { ok: v.startsWith("v22"), output: `node ${v} (workflow pins node-version: "22")`, durationMs: 0 };
}

async function checkArtifact() {
  const start = Date.now();
  const p = path.join(ROOT, "dist", "index.html");
  try {
    const s = await stat(p);
    return { ok: s.size > 0, output: `dist/index.html — ${s.size} bytes`, durationMs: Date.now() - start };
  } catch {
    return { ok: false, output: "dist/index.html does not exist — build step must run first", durationMs: Date.now() - start };
  }
}

async function fetchCheck(url, { wantHeaderIncludes } = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url);
    const headerVal = wantHeaderIncludes ? res.headers.get("cache-control") || "" : null;
    const ok = res.status === 200 && (!wantHeaderIncludes || headerVal.includes(wantHeaderIncludes));
    const lines = [`GET ${url} -> ${res.status}`];
    if (wantHeaderIncludes) lines.push(`cache-control: ${headerVal}`);
    return { ok, output: lines.join("\n"), durationMs: Date.now() - start, body: ok ? await res.text() : "" };
  } catch (err) {
    return { ok: false, output: `${url} -> ${err.message}`, durationMs: Date.now() - start, body: "" };
  }
}

async function waitForContainer(url, tries = 15) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.status) return true;
    } catch {
      /* not ready yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

const CHECKS = [
  { id: "workflow-file", phase: "Phase 1 (proxy)", title: "Workflow file present & structurally sane", fn: checkWorkflowFile },
  { id: "node-version", phase: "2.2", title: "Node version matches workflow pin (22.x)", fn: checkNodeVersion },
  { id: "npm-ci", phase: "2.2", title: "npm ci — lockfile installs cleanly", fn: () => run("npm", ["ci"]) },
  { id: "lint", phase: "2.3", title: "Lint passes (npm run lint)", fn: () => run("npm", ["run", "lint"]) },
  { id: "build", phase: "2.3", title: "Vite build succeeds (npm run build)", fn: () => run("npm", ["run", "build"]) },
  { id: "artifact", phase: "4.2", title: "Build artifact non-empty (dist/index.html)", fn: checkArtifact },
  { id: "docker-build", phase: "Docker map · Phase 2–3", title: "Docker image builds", fn: () => run("docker", ["build", "-t", IMAGE_TAG, "."]) },
  {
    id: "container-start",
    phase: "Docker map · 4.1",
    title: "Container starts and accepts connections",
    fn: async () => {
      await run("docker", ["rm", "-f", CONTAINER_NAME]); // best-effort, ignore result
      const started = await run("docker", ["run", "-d", "--name", CONTAINER_NAME, "-p", `${CONTAINER_PORT}:80`, IMAGE_TAG]);
      if (!started.ok) return started;
      const ready = await waitForContainer(`http://localhost:${CONTAINER_PORT}/`);
      return { ok: ready, output: ready ? `listening on :${CONTAINER_PORT}` : "container did not become ready in time", durationMs: started.durationMs };
    },
  },
  { id: "container-root", phase: "Docker map · 4.2", title: "GET / → 200", fn: () => fetchCheck(`http://localhost:${CONTAINER_PORT}/`) },
  {
    id: "container-deeplink",
    phase: "Docker map · 4.3 ⚠",
    title: "GET /unit/1/lesson/1a → 200, not 404 (SPA fallback)",
    fn: () => fetchCheck(`http://localhost:${CONTAINER_PORT}/unit/1/lesson/1a`),
  },
  {
    id: "container-asset",
    phase: "Docker map · 4.4",
    title: "Static asset loads with immutable cache header",
    fn: async () => {
      const root = await fetchCheck(`http://localhost:${CONTAINER_PORT}/`);
      const match = root.body.match(/\/assets\/[\w.-]+\.js/);
      if (!match) return { ok: false, output: "could not find an /assets/*.js reference in index.html", durationMs: 0 };
      return fetchCheck(`http://localhost:${CONTAINER_PORT}${match[0]}`, { wantHeaderIncludes: "immutable" });
    },
  },
];

async function cleanup() {
  await run("docker", ["rm", "-f", CONTAINER_NAME]);
  await run("docker", ["rmi", IMAGE_TAG]);
}

async function handleRun(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  for (const check of CHECKS) {
    send("update", { id: check.id, status: "running" });
    let result;
    try {
      result = await check.fn();
    } catch (err) {
      result = { ok: false, output: String(err.stack || err), durationMs: 0 };
    }
    send("update", {
      id: check.id,
      status: result.ok ? "pass" : "fail",
      output: result.output,
      durationMs: result.durationMs,
    });
  }

  await cleanup();
  send("done", {});
  res.end();
}

const server = createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    const html = await readFile(path.join(__dirname, "dashboard.html"), "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  if (req.url === "/api/checks" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(CHECKS.map(({ id, phase, title }) => ({ id, phase, title }))));
    return;
  }

  if (req.url === "/api/run" && req.method === "GET") {
    if (running) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "a run is already in progress" }));
      return;
    }
    running = true;
    try {
      await handleRun(res);
    } finally {
      running = false;
    }
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(DASHBOARD_PORT, () => {
  console.log(`CI dashboard running at http://localhost:${DASHBOARD_PORT}`);
});
