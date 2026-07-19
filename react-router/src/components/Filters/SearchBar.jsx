import { useState, useEffect, useContext } from "react";
import { PodcastContext } from "../../context/PodcastContext";
import styles from "./SearchBar.module.css";

/**
 * A search input component that updates the global search query with a built-in debounce.
 * It manages a local input state and updates the `PodcastContext` search value after
 * a 300ms delay to prevent excessive re-renders or API calls.
 *
 * @component
 * @returns {JSX.Element} A controlled search input element.
 */
export default function SearchBar() {
  const { search, setSearch } = useContext(PodcastContext);
  const [value, setValue] = useState(search);

  useEffect(() => {
    const id = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <input
      type="search"
      placeholder="Search podcasts…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.searchInput}
    />
  );
}
