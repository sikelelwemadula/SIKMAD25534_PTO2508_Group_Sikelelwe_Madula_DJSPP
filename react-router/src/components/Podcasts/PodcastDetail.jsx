import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import { useAudio } from "../../context/AudioContext";
import { PodcastContext } from "../../context/PodcastContext";

export default function PodcastDetail({ podcast, genres }) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];
  const navigate = useNavigate();
  const { playTrack } = useAudio();
  const { favorites, toggleFavorite } = useContext(PodcastContext);

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.header}>
        <img src={podcast.image} alt="Podcast Cover" className={styles.cover} />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <p className={styles.description}>{podcast.description}</p>

          <div className={styles.metaInfo}>
            <div className={styles.seasonInfo}>
              <div>
                <p>Genres</p>
                <GenreTags genres={genres} />
              </div>

              <div>
                <p>Last Updated:</p>
                <strong>{formatDate(podcast.updated)}</strong>
              </div>

              <div>
                <p>Total Seasons:</p>
                <strong>{podcast.seasons.length} Seasons</strong>
              </div>

              <div>
                <p>Total Episodes:</p>
                <strong>
                  {podcast.seasons.reduce(
                    (acc, s) => acc + s.episodes.length,
                    0
                  )}{" "}
                  Episodes
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.seasonDetails}>
        <div className={styles.seasonIntro}>
          <div className={styles.left}>
            <img className={styles.seasonCover} src={season.image} alt="" />
            <div>
              <h3>
                Season {selectedSeasonIndex + 1}: {season.title}
              </h3>
              <p>{season.description}</p>
              <p className={styles.releaseInfo}>
                {season.episodes.length} Episodes
              </p>
            </div>
          </div>
          <select
            value={selectedSeasonIndex}
            onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
            className={styles.dropdown}
          >
            {podcast.seasons.map((s, i) => (
              <option key={i} value={i}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => {
            const uniqueEpisodeId = `${podcast.id}-${selectedSeasonIndex + 1}-${ep.episode}`;
            const isFavorited = favorites.includes(uniqueEpisodeId);
            const trackData = {
              id: uniqueEpisodeId,
              title: ep.title,
              artist: podcast.title,
              src: ep.file,
            };

            return (
              <div key={index} className={styles.episodeCard}>
                <img
                  className={styles.episodeCover}
                  src={season.image}
                  alt=""
                />
                <button
                  type="button"
                  className={styles.favoriteButton}
                  onClick={() => toggleFavorite(uniqueEpisodeId)}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <span aria-hidden="true">{isFavorited ? "♥" : "♡"}</span>
                </button>
                <div className={styles.episodeInfo}>
                  <p className={styles.episodeTitle}>
                    Episode {index + 1}: {ep.title}
                  </p>
                  <p className={styles.episodeDesc}>{ep.description}</p>
                </div>
                <button
                  className={styles.playButton}
                  onClick={() => playTrack(trackData)}
                >
                  Play
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
