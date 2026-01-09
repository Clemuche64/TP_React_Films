import styles from "./Loader.module.css";

export default function Loader({ label = "Chargement..." }) {
    return (
        <div className={styles.wrap}>
            <div className={styles.spinner} />
            <p className={styles.text}>{label}</p>
        </div>
    );
}
