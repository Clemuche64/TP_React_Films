import { useMemo, useState } from "react";
import { useWishlist } from "../context/WishlistContext.jsx";
import MovieCard from "../components/MovieCard.jsx";
import styles from "./Wishlist.module.css";

export default function Wishlist() {
    const { wishlist } = useWishlist();
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return wishlist;
        // filtre simple sur le titre
        return wishlist.filter((m) => (m.title || "").toLowerCase().includes(q));
    }, [wishlist, query]);

    return (
        <main className={styles.page}>
            <header className={styles.top}>
                <div>
                    <h1 className={styles.title}>Wishlist</h1>
                    <p className={styles.subtitle}>{wishlist.length} film(s)</p>
                </div>

                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.input}
                    placeholder="Filtrer dans la wishlist..."
                />
            </header>

            {filtered.length === 0 ? (
                <div className={styles.empty}>Ta wishlist est vide (ou aucun résultat).</div>
            ) : (
                <div className={styles.grid}>
                    {filtered.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </main>
    );
}
