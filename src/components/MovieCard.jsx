import { Link } from "react-router-dom";
import { IMG_342 } from "../api/tmdb.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import styles from "./MovieCard.module.css";

export default function MovieCard({ movie }) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const inWish = isInWishlist(movie.id);

    const poster = movie.poster_path ? `${IMG_342}${movie.poster_path}` : null;

    function toggleWishlist() {
        // on ajoute ou on retire selon l'état actuel
        if (inWish) removeFromWishlist(movie.id);
        else addToWishlist(movie);
    }

    return (
        <article className={styles.card}>
            <Link to={`/movie/${movie.id}`} className={styles.posterLink}>
                {poster ? (
                    <img className={styles.poster} src={poster} alt={movie.title} loading="lazy" />
                ) : (
                    <div className={styles.noPoster}>Pas d’affiche</div>
                )}
            </Link>

            <div className={styles.body}>
                <h3 className={styles.title} title={movie.title}>
                    {movie.title}
                </h3>

                <div className={styles.meta}>
                    <span className={styles.vote}>⭐ {movie.vote_average?.toFixed?.(1) ?? "?"}</span>
                    <span className={styles.date}>{movie.release_date || "?"}</span>
                </div>

                <div className={styles.actions}>
                    <Link to={`/movie/${movie.id}`} className={styles.detailsBtn}>
                        Détails
                    </Link>

                    <button type="button" onClick={toggleWishlist} className={inWish ? styles.wishOn : styles.wishOff}>
                        {inWish ? "Retirer" : "Wishlist"}
                    </button>
                </div>
            </div>
        </article>
    );
}
