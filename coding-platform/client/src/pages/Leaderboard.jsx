import { useEffect, useState } from "react";
import api from "../api";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/leaderboard").then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2>🏆 Leaderboard</h2>
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p style={{ padding: 18 }}>Loading...</p>
        ) : (
          <table>
            <thead><tr><th>Rank</th><th>User</th><th>Score</th><th>Problems Solved</th><th>Submissions</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.user_id} style={r.isYou ? { background: "rgba(91,140,255,0.08)" } : {}}>
                  <td>#{r.rank}</td>
                  <td>{r.username}{r.isYou ? " (you)" : ""}</td>
                  <td>{r.score}</td>
                  <td>{r.problems_solved}</td>
                  <td>{r.total_submissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
