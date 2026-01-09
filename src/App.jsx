import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MovieList from "./pages/MovieList.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <Navbar />

      <Routes>
        <Route path="/" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
