import { Router } from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email, and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }
  const existing = db.prepare("SELECT id FROM users WHERE username = ? OR email = ?").get(username, email);
  if (existing) return res.status(409).json({ error: "Username or email already in use" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)").run(username, email, hash);

  const user = { id: info.lastInsertRowid, username };
  const token = signToken(user);
  res.status(201).json({ token, user: { id: user.id, username, email } });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "username and password are required" });
  const user = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").get(username, username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = signToken(user);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

router.get("/me", (req, res) => res.json({ ok: true }));

export default router;
