import React, { useContext, useEffect, useState } from "react";
import { PodcastContext } from "../context/PodcastContext";
import { fetchMultiplePodcasts } from "../api/fetchPata";
import { Loading } from "../components";
import { GenreFilter, SortSelect } from "../components"; // Adjust path if they aren't exported from index.js
import { genres } from "../data"; // Import the master genres list from your data file
import styles from "./FavouriteEpisodes.module.css";

export default function FavoriteEpisodes() {
  const { favorites, toggleFavorite, genre, sortKey } = useContext(PodcastContext);
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
                showTitle: show.title,
                seasonNumber: season.season,
                episodeNumber: episode.episode,
                title: episode.title,
                description: episode.description,
                genres: show.genres || [] // Keep track of the show's genres for filtering
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

  // Apply genre filter and sorting to favorites list based on the global context states
  const getFilteredAndSortedFavorites = () => {
    let data = [...favoriteEpisodesList];

    // 1. Filter by Genre
    if (genre !== "all") {
      data = data.filter((ep) => ep.genres.includes(Number(genre)));
    }

    // 2. Sort by Title A-Z / Z-A
    switch (sortKey) {
      case "title-asc":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return data;
  };

  const processedFavorites = getFilteredAndSortedFavorites();

  // Group the processed list by show title
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

      {/* Renders the filter controls underneath the main heading */}
      <section className={styles.controls} style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
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
              {episodes.map(episode => (
                <div key={episode.id} className={styles.episodeRow}>
                  <div className={styles.thumbnailPlaceholder}>
                    {showName ? showName.substring(0, 3).toUpperCase() : "POD"}
                  </div>

                  <div className={styles.contentDetails}>
                    <span className={styles.metaText}>
                      Season {episode.seasonNumber}: Episode {episode.episodeNumber}
                    </span>
                    <h3 className={styles.episodeTitle}>{episode.title}</h3>
                    <p className={styles.description}>{episode.description}</p>
                  </div>

                  <button 
                    onClick={() => toggleFavorite(episode.id)}
                    className={styles.heartButton}
                    aria-label="Remove from favorites"
                    style={{ fontSize: "24px", color: "#ff4d4d", background: "none", border: "none", cursor: "pointer" }}
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}