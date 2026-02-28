const OMDB_BASE = "https://www.omdbapi.com/";

async function callOmdb(params) {
  const searchParams = new URLSearchParams({
    apikey: process.env.OMDB_API_KEY,
    ...params
  });

  const response = await fetch(`${OMDB_BASE}?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error(`OMDB request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "OMDB request failed.");
  }

  return data;
}

export async function searchMovies(query, page = "1") {
  const data = await callOmdb({ s: query, type: "movie", page });
  return data.Search || [];
}

export async function getByImdbId(imdbId) {
  return callOmdb({ i: imdbId, plot: "short" });
}
