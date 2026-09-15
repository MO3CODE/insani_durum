// Shared edit storage for the report's editable fields, backed by a JSON
// file committed to this same GitHub repo (data/report-data.json) — no
// database service to provision, GitHub's Contents API is the store.
//
// Requires a GITHUB_TOKEN env var (a PAT with contents:write on this repo)
// set in the Vercel project. EDIT_PASSWORD is optional: if set, writes must
// carry a matching X-Edit-Password header.

const REPO = "MO3CODE/insani_durum";
const BRANCH = "main";
const DATA_PATH = "data/report-data.json";
const KEY_RE = /^(ar|tr|en)-(date|total|families|governorates|gov-location|damage-[0-3])$/;
const MAX_VALUE_LEN = 400;

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
  const res = await githubRequest(`contents/${DATA_PATH}?ref=${BRANCH}`);
  if (res.status === 404) return { data: {}, sha: null };
  if (!res.ok) throw new Error(`github read failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, "base64").toString("utf-8");
  let data;
  try {
    data = JSON.parse(content);
  } catch {
    data = {};
  }
  return { data, sha: json.sha };
}

async function writeData(data, sha, message) {
  const body = {
    message,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  return githubRequest(`contents/${DATA_PATH}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (!process.env.GITHUB_TOKEN) {
    res.status(500).json({ error: "server not configured" });
    return;
  }

  if (req.method === "GET") {
    try {
      const { data } = await readData();
      res.status(200).json(data);
    } catch (e) {
      res.status(502).json({ error: "upstream read failed" });
    }
    return;
  }

  if (req.method === "POST") {
    if (process.env.EDIT_PASSWORD) {
      const given = req.headers["x-edit-password"];
      if (given !== process.env.EDIT_PASSWORD) {
        res.status(401).json({ error: "unauthorized" });
        return;
      }
    }

    const body = req.body || {};

    if (body.reset === true) {
      try {
        const { sha } = await readData();
        const putRes = await writeData({}, sha, "Reset all fields via web edit");
        if (!putRes.ok) throw new Error(String(putRes.status));
        res.status(200).json({ ok: true });
      } catch (e) {
        res.status(502).json({ error: "reset failed" });
      }
      return;
    }

    const { key, value } = body;
    if (typeof key !== "string" || !KEY_RE.test(key)) {
      res.status(400).json({ error: "invalid key" });
      return;
    }
    if (typeof value !== "string" || value.length > MAX_VALUE_LEN) {
      res.status(400).json({ error: "invalid value" });
      return;
    }

    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const { data, sha } = await readData();
        data[key] = value;
        const putRes = await writeData(data, sha, `Update ${key} via web edit`);
        if (putRes.ok) {
          res.status(200).json({ ok: true });
          return;
        }
        if (putRes.status !== 409) throw new Error(String(putRes.status));
        // 409: sha went stale between our read and write — retry once with a fresh sha.
      }
      res.status(409).json({ error: "conflict, retry" });
    } catch (e) {
      res.status(502).json({ error: "upstream write failed" });
    }
    return;
  }

  res.status(405).json({ error: "method not allowed" });
};
