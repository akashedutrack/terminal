import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../api";

const MONACO_LANG = { javascript: "javascript", python: "python" };

export default function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => {
    api.get(`/submissions/history?slug=${slug}`).then((res) => setHistory(res.data));
  }, [slug]);

  useEffect(() => {
    setProblem(null); setResult(null); setError("");
    api.get(`/problems/${slug}`)
      .then((res) => {
        setProblem(res.data);
        const lang = res.data.lastSubmission?.language || "javascript";
        setLanguage(lang);
        setCode(res.data.lastSubmission?.code || res.data.starterCode[lang] || "");
      })
      .catch((err) => setError(err.response?.data?.error || "Failed to load problem"));
    loadHistory();
  }, [slug, loadHistory]);

  function handleLanguageChange(newLang) {
    setLanguage(newLang);
    if (problem) setCode(problem.starterCode[newLang] || "");
  }

  async function runCode() {
    setBusy(true); setBusyAction("run"); setError(""); setResult(null);
    try {
      const { data } = await api.post("/submissions/run", { slug, language, code });
      setResult({ ...data, mode: "run" });
    } catch (err) {
      setError(err.response?.data?.error || "Run failed");
    } finally { setBusy(false); setBusyAction(null); }
  }

  async function submitCode() {
    setBusy(true); setBusyAction("submit"); setError(""); setResult(null);
    try {
      const { data } = await api.post("/submissions/submit", { slug, language, code });
      setResult({ ...data, mode: "submit" });
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.error || "Submit failed");
    } finally { setBusy(false); setBusyAction(null); }
  }

  if (error && !problem) return <div className="container"><div className="error-box">{error}</div></div>;
  if (!problem) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="grid cols-2" style={{ alignItems: "start" }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ marginTop: 0 }}>{problem.title}</h2>
            <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
          </div>
          <p style={{ color: "var(--text-dim)" }}>{problem.points} points</p>
          <pre style={{ whiteSpace: "pre-wrap", background: "transparent", border: "none", padding: 0 }}>{problem.description}</pre>
          <h4>Sample Test Cases</h4>
          {problem.sampleTests.map((t, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Input:</div>
              <pre>{t.input}</pre>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Expected Output:</div>
              <pre>{t.expected_output}</pre>
            </div>
          ))}
          <h4>Recent Submissions</h4>
          {history.length === 0 ? (
            <p style={{ color: "var(--text-dim)" }}>No submissions yet.</p>
          ) : (
            <table>
              <thead><tr><th>Status</th><th>Lang</th><th>Passed</th><th>When</th></tr></thead>
              <tbody>
                {history.slice(0, 5).map((h) => (
                  <tr key={h.id}>
                    <td>{h.status}</td><td>{h.language}</td>
                    <td>{h.passed_count}/{h.total_count}</td>
                    <td>{new Date(h.created_at + "Z").toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="secondary" onClick={runCode} disabled={busy}>
                {busyAction === "run" ? "Running..." : "▶ Run (sample)"}
              </button>
              <button onClick={submitCode} disabled={busy}>
                {busyAction === "submit" ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
          <Editor height="420px" theme="vs-dark" language={MONACO_LANG[language]} value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }} />
          {error && <div className="error-box" style={{ marginTop: 12 }}>{error}</div>}
          {result && (
            <div style={{ marginTop: 14 }}>
              <h4>
                {result.mode === "submit" ? "Submission Result: " : "Run Result: "}
                <span style={{ color: result.overallStatus === "Accepted" ? "var(--accent-2)" : "var(--danger)" }}>
                  {result.overallStatus}
                </span>{" "}
                ({result.passedCount}/{result.totalCount} passed, {result.runtimeMs}ms)
              </h4>
              {result.results.map((r, i) => (
                <div key={i} className={`card result-row ${r.status.replace(/\s/g, "-")}`} style={{ marginBottom: 8 }}>
                  <strong>Test {i + 1}: {r.status}</strong> ({r.runtimeMs}ms)
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>Input:</div>
                  <pre>{r.input}</pre>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Expected:</div>
                  <pre>{r.expected}</pre>
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Your Output:</div>
                  <pre>{r.actual || "(empty)"}</pre>
                  {r.stderr && (<><div style={{ fontSize: 12, color: "var(--danger)" }}>Stderr:</div><pre>{r.stderr}</pre></>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
