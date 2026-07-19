import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastCard.module.css";
import GenreTags from "../UI/GenreTags";

/**
 * A preview card component for an individual podcast show.
 * Displays the show's cover image, title, total seasons, genre tags, and formatted last updated date.
 * Clicking anywhere on the card navigates the user to the detailed view of that specific show.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.podcast - The detailed data object representing the podcast show.
 * @param {string} props.podcast.id - The unique identifier of the podcast show.
 * @param {string} props.podcast.title - The display title of the podcast.
 * @param {string} props.podcast.image - The URL string pointing to the podcast's thumbnail image.
 * @param {number} props.podcast.seasons - The total number of seasons available for the podcast.
 * @param {number[]} props.podcast.genres - Array of genre IDs associated with the podcast.
 * @param {string} props.podcast.updated - The ISO 8601 timestamp representing the last update date.
 * @returns {JSX.Element} A clickable card element showcasing summary information for a show.
 */
export default function PodcastCard({ podcast }) {
  const navigate = useNavigate();

  const handleNavigate = (preview) => {
    navigate(`/show/${preview.id}`, { state: { genres: preview.genres } });
  };

  return (
    <div className={styles.card} onClick={() => handleNavigate(podcast)}>
      <img src={podcast.image} alt={podcast.title} />

      <h3>{podcast.title}</h3>
      <p className={styles.seasons}>{podcast.seasons} seasons</p>
      <GenreTags genres={podcast.genres} />
      <p className={styles.updatedText}>
        Updated {formatDate(podcast.updated)}
      </p>
    </div>
  );
}