import { useContext } from "react";
import { PodcastContext } from "../../context/PodcastContext";
import styles from "./GenreFilter.module.css";

/**
 * A dropdown filter component that allows users to filter podcasts by genre.
 * It syncs the selected genre with the global `PodcastContext`.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object[]} props.genres - The array of available genres.
 * @param {number} props.genres[].id - The unique identifier for the genre.
 * @param {string} props.genres[].title - The display name of the genre.
 * @returns {JSX.Element} A dropdown select element for genre filtering.
 */
export default function GenreFilter({ genres }) {
  const { genre, setGenre } = useContext(PodcastContext);

  return (
    <select
      className={styles.select}
      value={genre}
      onChange={(e) => setGenre(e.target.value)}
    >
      <option value="all">All Genres</option>
      {genres.map((g) => (
        <option key={g.id} value={g.id}>
          {g.title}
        </option>
      ))}
    </select>
  );
}
