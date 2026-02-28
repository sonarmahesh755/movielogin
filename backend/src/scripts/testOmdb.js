import dotenv from "dotenv";
import { searchMovies } from "../services/omdbService.js";

dotenv.config();

(async () => {
  try {
    const movies = await searchMovies("Batman");
    console.log("OMDB fetch successful. First 3 titles:", movies.slice(0, 3).map((m) => m.Title));
  } catch (error) {
    console.error("OMDB test failed:", error.message);
    process.exitCode = 1;
  }
})();
