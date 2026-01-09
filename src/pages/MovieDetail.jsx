import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMovieCredits, fetchMovieDetail, fetchSimilarMovies, fetchMovieVideos, pickBestYouTubeTrailer, IMG_500, IMG_342 } from "../api/tmdb.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import MovieCard from "../components/MovieCard.jsx";
import Loader from "../components/Loader.jsx";
import styles from "./MovieDetail.module.css";

export default function MovieDetail() {
    const { id } = useParams();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [similar, setSimilar] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [trailer, setTrailer] = useState(null);

    const inWish = isInWishlist(Number(id));

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");

            try {
                const [m, c, s, v] = await Promise.all([
                    fetchMovieDetail(id),
                    fetchMovieCredits(id),
                    fetchSimilarMovies(id, 1),
                    fetchMovieVideos(id),
                ]);

                setMovie(m);
                setCast((c.cast || []).slice(0, 10));
                setSimilar(s.results || []);

                const bestTrailer = pickBestYouTubeTrailer(v.results || []);
                setTrailer(bestTrailer);
            } catch (e) {
                setError("Impossible de charger le film.");
                setMovie(null);
                setCast([]);
                setSimilar([]);
                setTrailer(null);
            } finally {
                setLoading(false);
            }

        }

        // recharge quand l'id change
        load();
    }, [id]);

    function toggleWishlist() {
        if (!movie) return;
        if (inWish) removeFromWishlist(movie.id);
        else addToWishlist(movie);
    }

    const poster = movie?.poster_path ? `${IMG_500}${movie.poster_path}` : null;

    return (
        <main className={styles.page}>
            <div className={styles.topbar}>
                <Link to="/" className={styles.back}>← Retour</Link>

                <button type="button" onClick={toggleWishlist} className={inWish ? styles.wishOn : styles.wishOff}>
                    {inWish ? "Retirer de la wishlist" : "Ajouter à la wishlist"}
                </button>
            </div>

            {loading && <Loader label="Chargement du film..." />}
            {!loading && error && <div className={styles.error}>{error}</div>}

            {!loading && !error && movie && (
                <>
                    <section className={styles.hero}>
                        <div className={styles.posterWrap}>
                            {poster ? (
                                <img className={styles.poster} src={poster} alt={movie.title} />
                            ) : (
                                <div className={styles.noPoster}>Pas d’affiche</div>
                            )}
                        </div>

                        <div className={styles.info}>
                            <h1 className={styles.title}>{movie.title}</h1>

                            <div className={styles.meta}>
                                <span>⭐ {movie.vote_average?.toFixed?.(1) ?? "?"}</span>
                                <span>{movie.release_date || "?"}</span>
                                <span>{movie.runtime ? `${movie.runtime} min` : "?"}</span>
                            </div>

                            <p className={styles.overview}>
                                {movie.overview || "Pas de résumé disponible."}
                            </p>

                            {movie.genres?.length > 0 && (
                                <div className={styles.genres}>
                                    {movie.genres.map((g) => (
                                        <span key={g.id} className={styles.genre}>{g.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.h2}>Bande-annonce</h2>

                        {trailer ? (
                            <div className={styles.videoWrap}>
                                <iframe
                                    className={styles.iframe}
                                    src={`https://www.youtube.com/embed/${trailer.key}`}
                                    title={trailer.name || "Bande-annonce"}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className={styles.muted}>Aucune bande-annonce disponible pour ce film.</div>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.h2}>Acteurs principaux</h2>

                        <div className={styles.castGrid}>
                            {cast.map((p) => {
                                const img = p.profile_path ? `${IMG_342}${p.profile_path}` : null;
                                return (
                                    <article key={p.cast_id ?? p.credit_id} className={styles.castCard}>
                                        {img ? (
                                            <img className={styles.castImg} src={img} alt={p.name} loading="lazy" />
                                        ) : (
                                            <div className={styles.castNoImg}>No photo</div>
                                        )}
                                        <div className={styles.castText}>
                                            <p className={styles.castName}>{p.name}</p>
                                            <p className={styles.castRole}>{p.character}</p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.h2}>Films similaires</h2>

                        <div className={styles.similarGrid}>
                            {similar.slice(0, 12).map((m) => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
