import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const problems = db.prepare(
    `SELECT p.id, p.slug, p.title, p.difficulty, p.points,
            EXISTS(
              SELECT 1 FROM submissions s
              WHERE s.problem_id = p.id AND s.user_id = ? AND s.status = 'Accepted'
            ) AS solved
     FROM problems p ORDER BY p.id ASC`
  ).all(req.user.id);
  res.json(problems.map((p) => ({ ...p, solved: !!p.solved })));
});

router.get("/:slug", requireAuth, (req, res) => {
  const problem = db.prepare("SELECT * FROM problems WHERE slug = ?").get(req.params.slug);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const samples = db.prepare(
    "SELECT input, expected_output FROM test_cases WHERE problem_id = ? AND is_sample = 1"
  ).all(problem.id);

  const lastSubmission = db.prepare(
    `SELECT language, code FROM submissions WHERE user_id = ? AND problem_id = ? ORDER BY created_at DESC LIMIT 1`
  ).get(req.user.id, problem.id);

  res.json({
    id: problem.id, slug: problem.slug, title: problem.title, difficulty: problem.difficulty,
    points: problem.points, description: problem.description,
    starterCode: { javascript: problem.starter_js, python: problem.starter_py },
    sampleTests: samples, lastSubmission: lastSubmission || null,
  });
});

export default router;
