export default function MovieRow({ title, items }) {
  const displayTitle = {
    trending: "Trending Now",
    action: "Action Movies",
    comedy: "Comedy Movies",
    sciFi: "Sci-Fi",
    drama: "Drama",
    family: "Family Picks"
  }[title] || title;

  return (
    <section className="movie-row">
      <h2>{displayTitle}</h2>
      <div className="cards">
        {items
          .filter((movie) => movie.Poster && movie.Poster !== "N/A")
          .map((movie) => (
            <article key={movie.imdbID} className="movie-card">
              <img src={movie.Poster} alt={movie.Title} loading="lazy" />
              <div className="overlay">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
