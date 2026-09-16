import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import api from "../api";

const COLORS = ["#5b8cff", "#35d07f", "#ffb84d", "#ff5b6e", "#a78bfa", "#4fd1c5"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/analytics")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load analytics"));
  }, []);

  if (error) return <div className="container"><div className="error-box">{error}</div></div>;
  if (!data) return <div className="container">Loading...</div>;

  const difficultyChart = data.totalByDifficulty.map((t) => {
    const solved = data.solvedByDifficulty.find((s) => s.difficulty === t.difficulty)?.count || 0;
    return { difficulty: t.difficulty, solved, remaining: t.count - solved };
  });

  const statusPie = data.statusBreakdown.map((s) => ({ name: s.status, value: s.count }));
  const langPie = data.languageBreakdown.map((l) => ({ name: l.language, value: l.count }));

  return (
    <div className="container">
      <h2>📊 Performance Dashboard</h2>
      <div className="grid cols-4" style={{ marginBottom: 20 }}>
        <div className="card stat"><div className="value">{data.totalPoints}</div><div className="label">Total Points</div></div>
        <div className="card stat"><div className="value">{data.acceptedSubmissions}</div><div className="label">Accepted Submissions</div></div>
        <div className="card stat"><div className="value">{data.totalSubmissions}</div><div className="label">Total Submissions</div></div>
        <div className="card stat"><div className="value">{data.acceptanceRate}%</div><div className="label">Acceptance Rate</div></div>
      </div>
      <div className="grid cols-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h4>Solved by Difficulty</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={difficultyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" />
              <XAxis dataKey="difficulty" stroke="#9aa0b4" />
              <YAxis stroke="#9aa0b4" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#161925", border: "1px solid #2a2f42" }} />
              <Legend />
              <Bar dataKey="solved" stackId="a" fill="#35d07f" name="Solved" />
              <Bar dataKey="remaining" stackId="a" fill="#2a2f42" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h4>Submission Activity (last 30 days)</h4>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" />
              <XAxis dataKey="day" stroke="#9aa0b4" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9aa0b4" allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#161925", border: "1px solid #2a2f42" }} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#5b8cff" name="Submissions" />
              <Line type="monotone" dataKey="accepted" stroke="#35d07f" name="Accepted" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid cols-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h4>Submission Status Breakdown</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={90} label>
                {statusPie.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "#161925", border: "1px solid #2a2f42" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h4>Language Usage</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={langPie} dataKey="value" nameKey="name" outerRadius={90} label>
                {langPie.map((_, i) => (<Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "#161925", border: "1px solid #2a2f42" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h4>Average Runtime per Solved Problem (accepted submissions)</h4>
        {data.avgRuntimeByProblem.length === 0 ? (
          <p style={{ color: "var(--text-dim)" }}>Solve some problems to see runtime stats.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.avgRuntimeByProblem} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2f42" />
              <XAxis type="number" stroke="#9aa0b4" />
              <YAxis type="category" dataKey="title" stroke="#9aa0b4" width={150} />
              <Tooltip contentStyle={{ background: "#161925", border: "1px solid #2a2f42" }} />
              <Bar dataKey="avg_runtime_ms" fill="#5b8cff" name="Avg ms" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
