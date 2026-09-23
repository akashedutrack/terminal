import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

function formatDuration(totalSeconds) {
  if (totalSeconds == null) return "…";
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function ContestDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [tab, setTab] = useState("problems");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    api
      .get(`/contests/${slug}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load contest"));
  }, [slug]);

  useEffect(() => {
    if (tab === "leaderboard" && !leaderboard) {
      api
        .get(`/contests/${slug}/leaderboard`)
        .then((res) => setLeaderboard(res.data))
        .catch(() => setLeaderboard([]));
    }
  }, [tab, slug, leaderboard]);

  useEffect(() => {
    if (!data) return;
    const target =
      data.status === "upcoming" ? new Date(data.contest.start_time + "Z") : new Date(data.contest.end_time + "Z");
    const tick = () => setRemaining(Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data]);

  if (error) return <div style={{ padding: 20, color: "crimson" }}>{error}</div>;
  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  const { contest, problems, status } = data;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 16px" }}>
      <h2>{contest.title}</h2>
      <p style={{ opacity: 0.8 }}>{contest.description}</p>

      <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: "1px solid #333" }}>
        {status === "upcoming" && (
          <>
            Starts in <strong>{formatDuration(remaining)}</strong>
          </>
        )}
        {status === "live" && (
          <>
            Time remaining: <strong>{formatDuration(remaining)}</strong>
          </>
        )}
        {status === "ended" && <>This contest has ended.</>}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("problems")} disabled={tab === "problems"}>
          Problems
        </button>
        <button onClick={() => setTab("leaderboard")} disabled={tab === "leaderboard"}>
          Leaderboard
        </button>
      </div>

      {tab === "problems" && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Problem</th>
              <th>Points</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.id} style={{ borderTop: "1px solid #333" }}>
                <td style={{ padding: "8px 0" }}>
                  {status === "upcoming" ? p.title : <Link to={`/problems/${p.slug}`}>{p.title}</Link>}
                </td>
                <td style={{ textAlign: "center" }}>{p.points}</td>
                <td style={{ textAlign: "center" }}>{p.solved ? "✅ Solved" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "leaderboard" && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Total Time</th>
            </tr>
          </thead>
          <tbody>
            {(leaderboard || []).map((row) => (
              <tr key={row.user_id} style={{ borderTop: "1px solid #333" }}>
                <td>#{row.rank}</td>
                <td>{row.username}</td>
                <td style={{ textAlign: "center" }}>{row.score}</td>
                <td style={{ textAlign: "center" }}>{formatDuration(row.totalSeconds)}</td>
              </tr>
            ))}
            {leaderboard && leaderboard.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 12, opacity: 0.7 }}>
                  No one has solved a problem yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
