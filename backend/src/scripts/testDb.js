import dotenv from "dotenv";
import pool, { initDb } from "../db/pool.js";

dotenv.config();

(async () => {
  try {
    await initDb();
    const [rows] = await pool.query("SELECT COUNT(*) AS count FROM users");
    console.log("DB connection successful. users count:", rows[0].count);
    await pool.end();
  } catch (error) {
    console.error("DB test failed:", error.message);
    process.exitCode = 1;
  }
})();
