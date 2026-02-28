import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getByImdbId, searchMovies } from "../services/omdbService.js";

const router = Router();

const categories = [
  { key: "trending", query: "Marvel" },
  { key: "action", query: "Action" },
  { key: "comedy", query: "Comedy" },
  { key: "sciFi", query: "Sci-Fi" },
  { key: "drama", query: "Drama" },
  { key: "family", query: "Animation" }
];

router.use(authRequired);

router.get("/home", async (req, res) => {
  try {
    const rows = await Promise.all(
      categories.map(async (category) => ({
        title: category.key,
        query: category.query,
        items: await searchMovies(category.query)
      }))
    );

    const heroCandidate = rows[0]?.items?.[0];
    let hero = null;
    if (heroCandidate?.imdbID) {
      try {
        hero = await getByImdbId(heroCandidate.imdbID);
      } catch {
        hero = heroCandidate;
      }
    }

    return res.json({ hero, rows });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch home feed.", error: error.message });
  }
});

router.get("/search", async (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).json({ message: "Query parameter q is required." });
  }

  try {
    const movies = await searchMovies(String(q));
    return res.json({ movies });
  } catch (error) {
    return res.status(500).json({ message: "Search failed.", error: error.message });
  }
});

export default router;
