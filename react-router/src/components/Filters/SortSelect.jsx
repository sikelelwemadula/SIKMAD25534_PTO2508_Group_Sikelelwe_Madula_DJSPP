import { useContext } from "react";
import { SORT_OPTIONS, PodcastContext } from "../../context/PodcastContext";
import styles from "./SortSelect.module.css";

/**
 * A dropdown select component that allows users to choose a sorting criteria for the podcasts.
 * It maps through predefined sorting options and syncs the selection with the global `PodcastContext`.
 *
 * @component
 * @returns {JSX.Element} A controlled dropdown select element for sorting.
 */
export default function SortSelect() {
  const { sortKey, setSortKey } = useContext(PodcastContext);

  return (
    <select
      className={styles.select}
      value={sortKey}
      onChange={(e) => setSortKey(e.target.value)}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}