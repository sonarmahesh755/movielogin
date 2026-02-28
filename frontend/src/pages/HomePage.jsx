import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import MovieRow from "../components/MovieRow";

export default function HomePage() {
  const [feed, setFeed] = useState({ hero: null, rows: [] });
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    let isMounted = true;

    apiRequest("/movies/home")
      .then((data) => {
        if (isMounted) setFeed(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth", { replace: true });
  };

  const onSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await apiRequest(`/movies/search?q=${encodeURIComponent(query.trim())}`);
      setSearchResults(data.movies || []);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const heroPoster = feed.hero?.Poster && feed.hero?.Poster !== "N/A" ? feed.hero.Poster : "";

  return (
    <main className="home-shell">
      <header className="top-nav">
        <div className="brand">MOVIEBOX</div>
        <form className="search" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="user-actions">
          <span>{user?.name || "User"}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section
        className="hero"
        style={{
          backgroundImage: heroPoster
            ? `linear-gradient(to top, #141414 20%, rgba(20,20,20,0.3) 70%), url(${heroPoster})`
            : "linear-gradient(135deg, #111, #2b2b2b)"
        }}
      >
        <div className="hero-content">
          <h1>{feed.hero?.Title || "Unlimited Movies"}</h1>
          <p>{feed.hero?.Plot || "Watch your favorites with a cinematic browsing experience."}</p>
          <div className="hero-buttons">
            <button className="play">Play</button>
            <button className="more">More Info</button>
          </div>
        </div>
      </section>

      {error && <p className="error banner">{error}</p>}

      {searchResults.length > 0 ? (
        <MovieRow title="Search Results" items={searchResults} />
      ) : (
        feed.rows.map((row) => <MovieRow key={row.title} title={row.title} items={row.items} />)
      )}
    </main>
  );
}
