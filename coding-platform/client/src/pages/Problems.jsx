import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/problems")
      .then((res) => setProblems(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load problems"))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "All" ? problems : problems.filter((p) => p.difficulty === filter);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Problems</h2>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
      </div>
      {error && <div className="error-box">{error}</div>}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p style={{ padding: 18 }}>Loading...</p>
        ) : (
          <table>
            <thead><tr><th>Status</th><th>Title</th><th>Difficulty</th><th>Points</th></tr></thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>{p.solved ? "✅" : "—"}</td>
                  <td><Link to={`/problems/${p.slug}`}>{p.title}</Link></td>
                  <td><span className={`badge ${p.difficulty}`}>{p.difficulty}</span></td>
                  <td>{p.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
