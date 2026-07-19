import React, { useContext, useEffect, useState } from "react";
import { PodcastContext } from "../context/PodcastContext";
import { useAudio } from "../context/AudioContext";
import { fetchMultiplePodcasts } from "../api/fetchPata";
import { Loading } from "../components";
import GenreFilter from "../components/filters/GenreFilter";
import SortSelect from "../components/filters/SortSelect";
import { genres } from "../data";
import styles from "./FavouriteEpisodes.module.css";

export default function FavoriteEpisodes() {
  const { favorites, toggleFavorite, genre, sortKey } = useContext(PodcastContext);
  const { playTrack } = useAudio();
  const [favoriteEpisodesList, setFavoriteEpisodesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteEpisodesList([]);
      return;
    }

    const loadFavoriteDetails = async () => {
      setLoading(true);
      
      const showIds = [...new Set(favorites.map(favId => String(favId).split("-")[0]))];
      const detailedShows = await fetchMultiplePodcasts(showIds);
      const compiledEpisodes = [];

      detailedShows.forEach(show => {
        if (!show || !show.seasons) return;
        show.seasons.forEach(season => {
          if (!season.episodes) return;
          season.episodes.forEach(episode => {
            const uniqueId = `${show.id}-${season.season}-${episode.episode}`;
            if (favorites.includes(uniqueId)) {
              compiledEpisodes.push({
                id: uniqueId,
                showId: show.id,
                showTitle: show.title,
                showImage: show.image,
                seasonNumber: season.season,
                episodeNumber: episode.episode,
                title: episode.title,
                description: episode.description,
                genres: show.genres || [],
                file: episode.file,
                updated: show.updated
              });
            }
          });
        });
      });

      setFavoriteEpisodesList(compiledEpisodes);
      setLoading(false);
    };

    loadFavoriteDetails();
  }, [favorites]);

  const getFilteredAndSortedFavorites = () => {
    let data = [...favoriteEpisodesList];

    if (genre !== "all") {
      const selectedGenre = genres.find((g) => String(g.id) === String(genre));

      if (selectedGenre) {
        data = data.filter((ep) =>
          selectedGenre.shows.includes(String(ep.showId))
        );
      }
    }

    switch (sortKey) {
      case "title-asc":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "date-asc":
        data.sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      case "date-desc":
        data.sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case "default":
      default:
        break;
    }

    return data;
  };

  const processedFavorites = getFilteredAndSortedFavorites();

  const groupedFavorites = processedFavorites.reduce((acc, episode) => {
    if (!acc[episode.showTitle]) {
      acc[episode.showTitle] = [];
    }
    acc[episode.showTitle].push(episode);
    return acc;
  }, {});

  if (loading) return <Loading message="Loading your favorites..." />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Favorite Episodes</h1>

      {/* Responsive layout controls */}
      <section className={styles.controls}>
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      {Object.keys(groupedFavorites).length === 0 ? (
        <p className={styles.emptyMessage}>No matching favorite episodes found.</p>
      ) : (
        Object.entries(groupedFavorites).map(([showName, episodes]) => (
          <div key={showName} className={styles.showCard}>
            <h2 className={styles.showTitleHeader}>{showName}</h2>

            <div className={styles.episodesList}>
              {episodes.map(episode => {
                const trackData = {
                  id: episode.id,
                  title: episode.title,
                  artist: episode.showTitle,
                  src: episode.file,
                };

                return (
                  <div key={episode.id} className={styles.episodeRow}>
                    <img 
                      src={episode.showImage} 
                      alt={episode.showTitle} 
                      className={styles.thumbnailPlaceholder} 
                    />

                    <div className={styles.contentDetails}>
                      <span className={styles.metaText}>
                        Season {episode.seasonNumber}: Episode {episode.episodeNumber}
                      </span>
                      <h3 className={styles.episodeTitle}>{episode.title}</h3>
                      <p className={styles.description}>{episode.description}</p>
                    </div>

                    {/* Styled action panel grouping player and favorites together */}
                    <div className={styles.actionsPanel}>
                      <button
                        className={styles.playButton}
                        onClick={() => playTrack(trackData)}
                      >
                        Play
                      </button>

                      <button 
                        onClick={() => toggleFavorite(episode.id)}
                        className={styles.heartButton}
                        aria-label="Remove from favorites"
                      >
                        ♥
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}