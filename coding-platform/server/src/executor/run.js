import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

/**
 * NOTE ON SECURITY:
 * This runs user-submitted code with the same OS-level privileges as the
 * server process, isolated only by a per-run temp directory and a wall-clock
 * timeout. Fine for local dev/learning use, not safe for public untrusted
 * traffic. For production, run each submission in an isolated container.
 */

const LANGUAGES = {
  javascript: { ext: "js", build: (file) => ({ cmd: "node", args: [file] }) },
  python: { ext: "py", build: (file) => ({ cmd: "python3", args: [file] }) },
};

export function isSupportedLanguage(lang) {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, lang);
}

function runOnce(cmd, args, input, timeoutMs) {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = "";
    let stderr = "";
    let killed = false;

    const child = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });

    const timer = setTimeout(() => {
      killed = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => {
      stdout += d.toString();
      if (stdout.length > 200000) child.kill("SIGKILL");
    });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: String(err), runtimeMs: Date.now() - start, timedOut: false, exitCode: -1 });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, runtimeMs: Date.now() - start, timedOut: killed, exitCode: code });
    });

    child.stdin.write(input ?? "");
    child.stdin.end();
  });
}

export async function runSubmission({ language, code, testCases, timeLimitMs = 3000 }) {
  if (!isSupportedLanguage(language)) throw new Error(`Unsupported language: ${language}`);
  const lang = LANGUAGES[language];
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "sub-"));
  const file = path.join(workDir, `main.${lang.ext}`);
  fs.writeFileSync(file, code, "utf8");

  const results = [];
  let totalRuntime = 0;

  try {
    for (const tc of testCases) {
      const { cmd, args } = lang.build(file);
      const r = await runOnce(cmd, args, tc.input, timeLimitMs);
      totalRuntime += r.runtimeMs;

      const actual = r.stdout.trim().replace(/\r\n/g, "\n");
      const expected = String(tc.expected_output).trim().replace(/\r\n/g, "\n");

      let status;
      if (r.timedOut) status = "Time Limit Exceeded";
      else if (r.exitCode !== 0) status = "Runtime Error";
      else if (actual === expected) status = "Passed";
      else status = "Wrong Answer";

      results.push({
        input: tc.input, expected, actual,
        stderr: r.stderr.slice(0, 2000), status, runtimeMs: r.runtimeMs,
        isSample: !!tc.is_sample,
      });
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  const passedCount = results.filter((r) => r.status === "Passed").length;
  const overallStatus =
    passedCount === results.length ? "Accepted" :
    results.some((r) => r.status === "Time Limit Exceeded") ? "Time Limit Exceeded" : "Wrong Answer";

  return { overallStatus, passedCount, totalCount: results.length, runtimeMs: totalRuntime, results };
}
