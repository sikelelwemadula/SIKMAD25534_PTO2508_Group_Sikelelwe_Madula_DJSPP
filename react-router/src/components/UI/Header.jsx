import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export default function Header() {
  return (
    <header className={styles.appHeader}>
      <div className={styles.headerContent}>
        <h1>
          <Link to="/">🎙️ Podcast App</Link>
        </h1>
        <nav>
          <Link to="/favorites">Favorite Episodes</Link>
        </nav>
      </div>

      <ThemeToggle />
    </header>
  );
}
