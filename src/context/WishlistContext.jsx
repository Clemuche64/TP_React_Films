import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "wishlist_movies_v1";

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState(() => {
        // on recharge la wishlist au démarrage
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        // on sauvegarde à chaque changement
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    }, [wishlist]);

    function addToWishlist(movie) {
        setWishlist((prev) => {
            const exists = prev.some((m) => m.id === movie.id);
            if (exists) return prev;
            return [...prev, movie];
        });
    }

    function removeFromWishlist(movieId) {
        setWishlist((prev) => prev.filter((m) => m.id !== movieId));
    }

    function isInWishlist(movieId) {
        return wishlist.some((m) => m.id === movieId);
    }

    const value = useMemo(
        () => ({ wishlist, addToWishlist, removeFromWishlist, isInWishlist }),
        [wishlist]
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist doit être utilisé dans WishlistProvider");
    return ctx;
}
