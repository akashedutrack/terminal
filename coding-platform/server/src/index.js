import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import db from "./db.js";
import authRoutes from "./routes/auth.js";
import problemsRoutes from "./routes/problems.js";
import submissionsRoutes from "./routes/submissions.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import analyticsRoutes from "./routes/analytics.js";
import contestsRoutes from "./routes/contests.js";

// Self-seed on boot if the database is empty. Safe to run every startup:
// it only does anything the first time (or after data is wiped, e.g. a
// free-tier restart with no persistent disk attached).
const problemCount = db.prepare("SELECT COUNT(*) c FROM problems").get().c;
if (problemCount === 0) {
  console.log("No problems found in database — running seed automatically...");
  await import("./seed.js");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: [CLIENT_ORIGIN, /\.app\.github\.dev$/], credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contests", contestsRoutes);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "..", "client", "dist");
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
