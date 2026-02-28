import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initDb } from "./db/pool.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: false
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "movie-auth-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize DB", error);
    process.exit(1);
  });
