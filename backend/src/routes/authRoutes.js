import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import pool from "../db/pool.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase(), passwordHash]
    );

    const user = { id: result.insertId, name: name.trim(), email: email.toLowerCase() };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed.", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const userRecord = rows[0];
    const isValidPassword = await bcrypt.compare(password, userRecord.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = { id: userRecord.id, name: userRecord.name, email: userRecord.email };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Login failed.", error: error.message });
  }
});

export default router;
