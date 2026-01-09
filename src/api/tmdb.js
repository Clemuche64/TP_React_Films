const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_342 = "https://image.tmdb.org/t/p/w342";
export const IMG_500 = "https://image.tmdb.org/t/p/w500";

function buildUrl(path, params = {}) {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.set("api_key", API_KEY);
    url.searchParams.set("language", "fr-FR");

    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });

    return url.toString();
}

async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export function fetchMoviesByCategory(category, page = 1) {
    // category: now_playing | popular | top_rated | upcoming
    const url = buildUrl(`/movie/${category}`, { page, include_adult: false });
    return getJson(url);
}

export function searchMovies(query, page = 1) {
    const url = buildUrl(`/search/movie`, { query, page, include_adult: false });
    return getJson(url);
}

export function fetchMovieDetail(id) {
    const url = buildUrl(`/movie/${id}`);
    return getJson(url);
}

export function fetchMovieCredits(id) {
    const url = buildUrl(`/movie/${id}/credits`);
    return getJson(url);
}

export function fetchSimilarMovies(id, page = 1) {
    const url = buildUrl(`/movie/${id}/similar`, { page });
    return getJson(url);
}

export function fetchMovieVideos(id) {
    const url = buildUrl(`/movie/${id}/videos`);
    return getJson(url);
}

// Choisit la meilleure bande-annonce YouTube parmi une liste de vidéos
export function pickBestYouTubeTrailer(results = []) {
    const yt = results.filter((v) => v.site === "YouTube");

    const officialTrailer = yt.find((v) => v.type === "Trailer" && v.official);
    if (officialTrailer) return officialTrailer;

    const trailer = yt.find((v) => v.type === "Trailer");
    if (trailer) return trailer;

    const teaser = yt.find((v) => v.type === "Teaser");
    if (teaser) return teaser;

    return yt[0] || null;
}

