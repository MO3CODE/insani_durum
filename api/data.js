// Shared storage for the weekly reports, backed by a JSON file committed to
// this same GitHub repo (data/reports.json) — no database service to
// provision, GitHub's Contents API is the store.
//
// The whole report is saved at once (one commit per save) and every week is
// kept as its own entry, so older reports stay available in the archive
// instead of being overwritten.
//
// Requires a GITHUB_TOKEN env var (a PAT with contents:write on this repo)
// set in the Vercel project. EDIT_PASSWORD is optional: if set, writes must
// carry a matching X-Edit-Password header.

const REPO = "MO3CODE/insani_durum";
// Preview deployments write to their own branch, so trying out a branch never
// touches the production data on main.
const BRANCH = process.env.VERCEL_GIT_COMMIT_REF || "main";
const DATA_PATH = "data/reports.json";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const GOV_RE = /^[a-z-]{2,20}$/;
const NEED_KEYS = ["food", "shelter", "cash", "nfi"];
const LANGS = ["ar", "tr", "en"];
const MAX_REPORTS = 520;
const MAX_TITLE_LEN = 80;
const MAX_COUNT = 100000000;

async function githubRequest(path, options = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "insani-durum-app",
      ...(options.headers || {}),
    },
  });
}

async function readData() {
  const res = await githubRequest(`contents/${DATA_PATH}?ref=${encodeURIComponent(BRANCH)}`);
  if (res.status === 404) return { reports: [], sha: null };
  if (!res.ok) throw new Error(`github read failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  let reports = [];
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed.reports)) reports = parsed.reports;
  } catch {
    reports = [];
  }
  return { reports, sha: json.sha };
}

async function writeData(reports, sha, message) {
  const body = {
    message,
    content: Buffer.from(JSON.stringify({ reports }, null, 2) + "\n").toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  return githubRequest(`contents/${DATA_PATH}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function isCount(n, max) {
  return Number.isInteger(n) && n >= 0 && n <= max;
}

// Returns a clean copy of the report, or null if anything is malformed.
function cleanReport(r) {
  if (!r || typeof r !== "object") return null;
  if (!DATE_RE.test(r.start) || !DATE_RE.test(r.end) || r.end < r.start) return null;
  if (!isCount(r.total, MAX_COUNT) || !isCount(r.families, MAX_COUNT)) return null;
  if (!Array.isArray(r.governorates) || r.governorates.length > 30) return null;
  if (!r.governorates.every((g) => typeof g === "string" && GOV_RE.test(g))) return null;
  if (!r.needs || !NEED_KEYS.every((k) => isCount(r.needs[k], 100))) return null;
  if (!r.needsTitle || !LANGS.every((l) => typeof r.needsTitle[l] === "string" && r.needsTitle[l].length <= MAX_TITLE_LEN)) return null;
  return {
    id: r.start,
    start: r.start,
    end: r.end,
    total: r.total,
    families: r.families,
    governorates: [...new Set(r.governorates)],
    needsTitle: { ar: r.needsTitle.ar.trim(), tr: r.needsTitle.tr.trim(), en: r.needsTitle.en.trim() },
    needs: { food: r.needs.food, shelter: r.needs.shelter, cash: r.needs.cash, nfi: r.needs.nfi },
    updatedAt: new Date().toISOString(),
  };
}

// Reads, applies `change` to the list, and writes it back — retrying once if
// someone else saved in between (GitHub answers 409 on a stale sha).
async function updateReports(change, message) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const { reports, sha } = await readData();
    const next = change(reports.slice());
    next.sort((a, b) => (a.start < b.start ? 1 : -1));
    const putRes = await writeData(next, sha, message);
    if (putRes.ok) return next;
    if (putRes.status !== 409) throw new Error(String(putRes.status));
  }
  const err = new Error("conflict");
  err.conflict = true;
  throw err;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (!process.env.GITHUB_TOKEN) {
    res.status(500).json({ error: "server not configured" });
    return;
  }

  if (req.method === "GET") {
    try {
      const { reports } = await readData();
      res.status(200).json({ reports });
    } catch (e) {
      res.status(502).json({ error: "upstream read failed" });
    }
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "method not allowed" });
    return;
  }

  if (process.env.EDIT_PASSWORD && req.headers["x-edit-password"] !== process.env.EDIT_PASSWORD) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const body = req.body || {};

  try {
    if (body.action === "save") {
      const report = cleanReport(body.report);
      const previousId = typeof body.previousId === "string" && DATE_RE.test(body.previousId) ? body.previousId : null;
      if (!report) {
        res.status(400).json({ error: "invalid report" });
        return;
      }
      const reports = await updateReports((list) => {
        // A changed start date changes the id: drop the entry it replaces.
        const kept = list.filter((r) => r.id !== report.id && r.id !== previousId);
        if (kept.length >= MAX_REPORTS) throw new Error("too many reports");
        return [report, ...kept];
      }, `Save report ${report.id} via web edit`);
      res.status(200).json({ ok: true, reports });
      return;
    }

    if (body.action === "delete") {
      if (typeof body.id !== "string" || !DATE_RE.test(body.id)) {
        res.status(400).json({ error: "invalid id" });
        return;
      }
      const reports = await updateReports(
        (list) => list.filter((r) => r.id !== body.id),
        `Delete report ${body.id} via web edit`
      );
      res.status(200).json({ ok: true, reports });
      return;
    }

    res.status(400).json({ error: "unknown action" });
  } catch (e) {
    if (e.conflict) {
      res.status(409).json({ error: "conflict, retry" });
      return;
    }
    res.status(502).json({ error: "upstream write failed" });
  }
};
