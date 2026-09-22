import { Router } from "express";
import db from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function computeStatus(row, now) {
  if (now < row.start_time) return "upcoming";
  if (now > row.end_time) return "ended";
  return "live";
}

router.get("/", requireAuth, (req, res) => {
  const now = db.prepare("SELECT datetime('now') as now").get().now;
  const contests = db.prepare(
    `SELECT c.id, c.slug, c.title, c.description, c.start_time, c.end_time,
            (SELECT COUNT(*) FROM contest_problems cp WHERE cp.contest_id = c.id) AS problem_count
     FROM contests c ORDER BY c.start_time DESC`
  ).all();
  res.json({
    now,
    contests: contests.map((c) => ({ ...c, status: computeStatus(c, now) })),
  });
});

router.get("/:slug", requireAuth, (req, res) => {
  const now = db.prepare("SELECT datetime('now') as now").get().now;
  const contest = db.prepare("SELECT * FROM contests WHERE slug = ?").get(req.params.slug);
  if (!contest) return res.status(404).json({ error: "Contest not found" });

  const problems = db.prepare(
    `SELECT p.id, p.slug, p.title, p.difficulty, cp.points
     FROM contest_problems cp JOIN problems p ON p.id = cp.problem_id
     WHERE cp.contest_id = ? ORDER BY cp.points ASC, p.id ASC`
  ).all(contest.id);

  // Which of these problems has this user already solved within the contest window?
  const solvedRows = problems.length
    ? db.prepare(
        `SELECT DISTINCT s.problem_id
         FROM submissions s
         WHERE s.user_id = ? AND s.status = 'Accepted'
           AND s.problem_id IN (${problems.map(() => "?").join(",")})
           AND s.created_at BETWEEN ? AND ?`
      ).all(req.user.id, ...problems.map((p) => p.id), contest.start_time, contest.end_time)
    : [];
  const solvedSet = new Set(solvedRows.map((r) => r.problem_id));

  res.json({
    now,
    status: computeStatus(contest, now),
    contest,
    problems: problems.map((p) => ({ ...p, solved: solvedSet.has(p.id) })),
  });
});

router.get("/:slug/leaderboard", requireAuth, (req, res) => {
  const contest = db.prepare("SELECT * FROM contests WHERE slug = ?").get(req.params.slug);
  if (!contest) return res.status(404).json({ error: "Contest not found" });

  const contestProblems = db.prepare(
    "SELECT problem_id, points FROM contest_problems WHERE contest_id = ?"
  ).all(contest.id);
  if (contestProblems.length === 0) return res.json([]);

  // Earliest Accepted submission per (user, problem), within the contest's time window.
  // A submission "counts" for a contest purely by falling inside the window and
  // targeting a contest problem — no explicit tagging needed on the submissions table.
  const firstAccepts = db.prepare(
    `SELECT s.user_id, s.problem_id, MIN(s.created_at) AS solved_at
     FROM submissions s
     WHERE s.status = 'Accepted'
       AND s.problem_id IN (${contestProblems.map(() => "?").join(",")})
       AND s.created_at BETWEEN ? AND ?
     GROUP BY s.user_id, s.problem_id`
  ).all(...contestProblems.map((p) => p.problem_id), contest.start_time, contest.end_time);

  const pointsByProblem = Object.fromEntries(contestProblems.map((p) => [p.problem_id, p.points]));
  const users = new Map(); // user_id -> { score, totalSeconds, solvedCount }
  const secondsBetween = db.prepare("SELECT (julianday(?) - julianday(?)) * 86400 AS secs");

  for (const row of firstAccepts) {
    const entry = users.get(row.user_id) || { score: 0, totalSeconds: 0, solvedCount: 0 };
    entry.score += pointsByProblem[row.problem_id] || 0;
    entry.solvedCount += 1;
    const secs = secondsBetween.get(row.solved_at, contest.start_time).secs;
    entry.totalSeconds += Math.max(0, Math.round(secs));
    users.set(row.user_id, entry);
  }

  const userIds = [...users.keys()];
  if (userIds.length === 0) return res.json([]);
  const userRows = db.prepare(
    `SELECT id, username FROM users WHERE id IN (${userIds.map(() => "?").join(",")})`
  ).all(...userIds);
  const usernameById = Object.fromEntries(userRows.map((u) => [u.id, u.username]));

  const leaderboard = userIds
    .map((id) => ({ user_id: id, username: usernameById[id], ...users.get(id) }))
    .sort((a, b) => b.score - a.score || a.totalSeconds - b.totalSeconds);

  res.json(leaderboard.map((row, i) => ({ rank: i + 1, ...row })));
});

export default router;
