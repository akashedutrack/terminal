import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const LANGUAGES = {
  javascript: {
    filename: "main.js",
    run: (file) => ({ cmd: "node", args: [file] }),
  },
  python: {
    filename: "main.py",
    run: (file) => ({ cmd: "python3", args: [file] }),
  },
  c: {
    filename: "main.c",
    compile: (file, workDir) => ({
      cmd: "gcc",
      args: [file, "-O2", "-o", path.join(workDir, "a.out")],
    }),
    run: (file, workDir) => ({ cmd: path.join(workDir, "a.out"), args: [] }),
  },
  cpp: {
    filename: "main.cpp",
    compile: (file, workDir) => ({
      cmd: "g++",
      args: [file, "-O2", "-std=c++17", "-o", path.join(workDir, "a.out")],
    }),
    run: (file, workDir) => ({ cmd: path.join(workDir, "a.out"), args: [] }),
  },
  java: {
    filename: "Main.java",
    compile: (file, workDir) => ({ cmd: "javac", args: [file] }),
    run: (file, workDir) => ({ cmd: "java", args: ["-cp", workDir, "Main"] }),
  },
};

export function isSupportedLanguage(lang) {
  return Object.prototype.hasOwnProperty.call(LANGUAGES, lang);
}

export function supportedLanguages() {
  return Object.keys(LANGUAGES);
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
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

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

export async function runSubmission({ language, code, testCases, timeLimitMs = 3000, compileTimeoutMs = 10000 }) {
  if (!isSupportedLanguage(language)) throw new Error(`Unsupported language: ${language}`);
  const lang = LANGUAGES[language];
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "sub-"));
  const file = path.join(workDir, lang.filename);
  fs.writeFileSync(file, code, "utf8");

  try {
    if (lang.compile) {
      const { cmd, args } = lang.compile(file, workDir);
      const compileResult = await runOnce(cmd, args, "", compileTimeoutMs);
      if (compileResult.exitCode !== 0) {
        return {
          overallStatus: "Compilation Error",
          passedCount: 0,
          totalCount: testCases.length,
          runtimeMs: compileResult.runtimeMs,
          compileError: compileResult.stderr.slice(0, 4000) || compileResult.stdout.slice(0, 4000),
          results: [],
        };
      }
    }

    const results = [];
    let totalRuntime = 0;

    for (const tc of testCases) {
      const { cmd, args } = lang.run(file, workDir);
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
        input: tc.input,
        expected,
        actual,
        stderr: r.stderr.slice(0, 2000),
        status,
        runtimeMs: r.runtimeMs,
        isSample: !!tc.is_sample,
      });
    }

    const passedCount = results.filter((r) => r.status === "Passed").length;
    const overallStatus =
      passedCount === results.length
        ? "Accepted"
        : results.some((r) => r.status === "Time Limit Exceeded")
        ? "Time Limit Exceeded"
        : results.some((r) => r.status === "Runtime Error")
        ? "Runtime Error"
        : "Wrong Answer";

    return { overallStatus, passedCount, totalCount: results.length, runtimeMs: totalRuntime, results };
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}
