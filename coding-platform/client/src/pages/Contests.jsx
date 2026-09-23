import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const STATUS_COLORS = { upcoming: "#a65", live: "#2a5", ended: "#888" };

export default function Contests() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/contests")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load contests"));
  }, []);

  if (error) return <div style={{ padding: 20, color: "crimson" }}>{error}</div>;
  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: "0 16px" }}>
      <h2>Contests</h2>
      {data.contests.length === 0 && <p>No contests yet.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.contests.map((c) => (
          <Link key={c.id} to={`/contests/${c.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{
                border: "1px solid #333",
                borderRadius: 10,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{c.title}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>
                  {c.problem_count} problems · {new Date(c.start_time + "Z").toLocaleString()} –{" "}
                  {new Date(c.end_time + "Z").toLocaleString()}
                </div>
              </div>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  background: STATUS_COLORS[c.status],
                }}
              >
                {c.status.toUpperCase()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
