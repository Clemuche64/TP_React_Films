import { useEffect, useMemo, useState } from "react";
import useDebounce from "../hooks/useDebounce.js";
import { fetchMoviesByCategory, searchMovies } from "../api/tmdb.js";
import MovieCard from "../components/MovieCard.jsx";
import Loader from "../components/Loader.jsx";
import styles from "./MovieList.module.css";

const CATEGORIES = [
    { key: "now_playing", label: "Now Playing" },
    { key: "popular", label: "Popular" },
    { key: "top_rated", label: "Top Rated" },
    { key: "upcoming", label: "Upcoming" },
];

export default function MovieList() {
    const [category, setCategory] = useState("popular");
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 450);

    const [page, setPage] = useState(1);

    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const mode = useMemo(() => {
        // si on tape une recherche, on est en mode search
        return debouncedQuery.trim().length > 0 ? "search" : "category";
    }, [debouncedQuery]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");

            try {
                let data;

                if (mode === "search") {
                    data = await searchMovies(debouncedQuery.trim(), page);
                } else {
                    data = await fetchMoviesByCategory(category, page);
                }

                // on garde la liste de films + nb de pages pour la pagination
                setMovies(data.results || []);
                setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDb limite souvent à 500 pages
            } catch (e) {
                setError("Impossible de charger les films.");
                setMovies([]);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [category, mode, debouncedQuery, page]);

    useEffect(() => {
        // quand on change de catégorie ou on démarre une nouvelle recherche, on revient page 1
        setPage(1);
    }, [category, mode, debouncedQuery]);

    function prevPage() {
        setPage((p) => Math.max(1, p - 1));
    }

    function nextPage() {
        setPage((p) => Math.min(totalPages, p + 1));
    }

    return (
        <main className={styles.page}>
            <section className={styles.top}>
                <div className={styles.head}>
                    <h1 className={styles.title}>Films</h1>
                    <p className={styles.subtitle}>Liste, recherche, détails, wishlist</p>
                </div>

                <div className={styles.controls}>
                    <div className={styles.tabs} role="tablist" aria-label="Catégories">
                        {CATEGORIES.map((c) => (
                            <button
                                key={c.key}
                                type="button"
                                className={category === c.key && mode === "category" ? styles.tabActive : styles.tab}
                                onClick={() => {
                                    setQuery("");
                                    setCategory(c.key);
                                }}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.search}>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={styles.input}
                            placeholder="Rechercher un film..."
                        />
                        <button
                            type="button"
                            className={styles.clear}
                            onClick={() => setQuery("")}
                            disabled={!query}
                            title="Effacer"
                        >
                            Effacer
                        </button>
                    </div>
                </div>
            </section>

            <section className={styles.content}>
                {loading && <Loader label="Chargement des films..." />}
                {!loading && error && <div className={styles.error}>{error}</div>}

                {!loading && !error && (
                    <>
                        <div className={styles.grid}>
                            {movies.map((movie) => (
                                // boucle principale d'affichage
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>

                        <div className={styles.pagination}>
                            <button type="button" onClick={prevPage} className={styles.pageBtn} disabled={page <= 1}>
                                Précédent
                            </button>

                            <span className={styles.pageInfo}>
                                Page <b>{page}</b> / {totalPages}
                            </span>

                            <button
                                type="button"
                                onClick={nextPage}
                                className={styles.pageBtn}
                                disabled={page >= totalPages}
                            >
                                Suivant
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
