import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, (req, res) => {
  const userId = req.user.id;

  const totals = db.prepare(
    `SELECT COUNT(*) AS total_submissions,
            SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) AS accepted_submissions
     FROM submissions WHERE user_id = ?`
  ).get(userId);

  const solvedByDifficulty = db.prepare(
    `SELECT p.difficulty, COUNT(DISTINCT p.id) AS count
     FROM submissions s JOIN problems p ON p.id = s.problem_id
     WHERE s.user_id = ? AND s.status = 'Accepted' GROUP BY p.difficulty`
  ).all(userId);

  const totalByDifficulty = db.prepare(`SELECT difficulty, COUNT(*) AS count FROM problems GROUP BY difficulty`).all();

  const statusBreakdown = db.prepare(
    `SELECT status, COUNT(*) AS count FROM submissions WHERE user_id = ? GROUP BY status`
  ).all(userId);

  const languageBreakdown = db.prepare(
    `SELECT language, COUNT(*) AS count FROM submissions WHERE user_id = ? GROUP BY language`
  ).all(userId);

  const activity = db.prepare(
    `SELECT date(created_at) AS day, COUNT(*) AS count,
            SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) AS accepted
     FROM submissions WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
     GROUP BY day ORDER BY day ASC`
  ).all(userId);

  const avgRuntimeByProblem = db.prepare(
    `SELECT p.title, AVG(s.runtime_ms) AS avg_runtime_ms
     FROM submissions s JOIN problems p ON p.id = s.problem_id
     WHERE s.user_id = ? AND s.status = 'Accepted'
     GROUP BY p.id ORDER BY avg_runtime_ms DESC LIMIT 10`
  ).all(userId);

  const totalPoints = db.prepare(
    `SELECT COALESCE(SUM(p.points), 0) AS points
     FROM (SELECT DISTINCT problem_id FROM submissions WHERE user_id = ? AND status = 'Accepted') s
     JOIN problems p ON p.id = s.problem_id`
  ).get(userId);

  const acceptanceRate = totals.total_submissions > 0
    ? Math.round((totals.accepted_submissions / totals.total_submissions) * 1000) / 10
    : 0;

  res.json({
    totalSubmissions: totals.total_submissions || 0,
    acceptedSubmissions: totals.accepted_submissions || 0,
    acceptanceRate,
    totalPoints: totalPoints.points,
    solvedByDifficulty, totalByDifficulty, statusBreakdown, languageBreakdown,
    activity, avgRuntimeByProblem,
  });
});

export default router;
