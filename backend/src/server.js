import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initDb } from "./db/pool.js";
import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();

const app = express();

// 1. CORS Configuration
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true // Set to true if you plan to use cookies/sessions later
  })
);

app.use(express.json());

// 2. Health Check Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is live!", database: "Connecting..." });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "movie-auth-api" });
});

// 3. Routes (NOTICE THE /api PREFIX)
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);

// 4. Database Initialization & Export for Vercel
// On Vercel, we export the app. The 'listen' is only for local development.
initDb()
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch((error) => {
    console.error("Failed to initialize DB:", error);
  });

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

export default app;