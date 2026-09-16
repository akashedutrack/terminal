import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const rows = db.prepare(
    `
    WITH solved AS (
      SELECT DISTINCT user_id, problem_id FROM submissions WHERE status = 'Accepted'
    ),
    scored AS (
      SELECT s.user_id, SUM(p.points) AS score, COUNT(*) AS problems_solved
      FROM solved s JOIN problems p ON p.id = s.problem_id
      GROUP BY s.user_id
    )
    SELECT u.id AS user_id, u.username,
           COALESCE(sc.score, 0) AS score,
           COALESCE(sc.problems_solved, 0) AS problems_solved,
           (SELECT COUNT(*) FROM submissions sub WHERE sub.user_id = u.id) AS total_submissions
    FROM users u
    LEFT JOIN scored sc ON sc.user_id = u.id
    ORDER BY score DESC, problems_solved DESC, total_submissions ASC
    LIMIT 100
    `
  ).all();

  const ranked = rows.map((r, i) => ({ rank: i + 1, ...r, isYou: r.user_id === req.user.id }));
  res.json(ranked);
});

export default router;
