import { NavLink } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { wishlist } = useWishlist();

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <NavLink to="/" className={styles.logo}>
                    Clémuche's MovieBox
                </NavLink>

                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
                        Films
                    </NavLink>

                    <NavLink
                        to="/wishlist"
                        className={({ isActive }) => (isActive ? styles.active : styles.link)}
                    >
                        Wishlist <span className={styles.badge}>{wishlist.length}</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
