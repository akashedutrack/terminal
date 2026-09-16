import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { runSubmission, isSupportedLanguage } from "../executor/run.js";

const router = Router();

function loadProblem(slug) {
  return db.prepare("SELECT * FROM problems WHERE slug = ?").get(slug);
}

router.post("/run", requireAuth, async (req, res) => {
  const { slug, language, code } = req.body || {};
  if (!slug || !language || typeof code !== "string") {
    return res.status(400).json({ error: "slug, language, and code are required" });
  }
  if (!isSupportedLanguage(language)) return res.status(400).json({ error: `Unsupported language: ${language}` });
  const problem = loadProblem(slug);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const samples = db.prepare(
    "SELECT input, expected_output, is_sample FROM test_cases WHERE problem_id = ? AND is_sample = 1"
  ).all(problem.id);

  try {
    const result = await runSubmission({ language, code, testCases: samples, timeLimitMs: problem.time_limit_ms });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/submit", requireAuth, async (req, res) => {
  const { slug, language, code } = req.body || {};
  if (!slug || !language || typeof code !== "string") {
    return res.status(400).json({ error: "slug, language, and code are required" });
  }
  if (!isSupportedLanguage(language)) return res.status(400).json({ error: `Unsupported language: ${language}` });
  const problem = loadProblem(slug);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const allTests = db.prepare("SELECT input, expected_output, is_sample FROM test_cases WHERE problem_id = ?").all(problem.id);

  try {
    const result = await runSubmission({ language, code, testCases: allTests, timeLimitMs: problem.time_limit_ms });
    db.prepare(
      `INSERT INTO submissions (user_id, problem_id, language, code, status, passed_count, total_count, runtime_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(req.user.id, problem.id, language, code, result.overallStatus, result.passedCount, result.totalCount, result.runtimeMs);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/history", requireAuth, (req, res) => {
  const { slug } = req.query;
  let rows;
  if (slug) {
    const problem = loadProblem(slug);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    rows = db.prepare(
      `SELECT id, language, status, passed_count, total_count, runtime_ms, created_at
       FROM submissions WHERE user_id = ? AND problem_id = ? ORDER BY created_at DESC`
    ).all(req.user.id, problem.id);
  } else {
    rows = db.prepare(
      `SELECT s.id, p.title, p.slug, s.language, s.status, s.passed_count, s.total_count, s.runtime_ms, s.created_at
       FROM submissions s JOIN problems p ON p.id = s.problem_id
       WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 100`
    ).all(req.user.id);
  }
  res.json(rows);
});

export default router;
