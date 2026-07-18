import React, { useContext, useEffect, useState } from "react";
import { PodcastContext } from "../context/PodcastContext";
import { fetchMultiplePodcasts } from "../api/fetchPata";
import { Loading } from "../components";
import GenreFilter from "../components/filters/GenreFilter";
import SortSelect from "../components/filters/SortSelect";
import { genres } from "../data";
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
                showImage: show.image, // FIX 1: Save the actual podcast cover image URL here
                seasonNumber: season.season,
                episodeNumber: episode.episode,
                title: episode.title,
                description: episode.description,
                genres: show.genres || []
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
      data = data.filter((ep) => ep.genres.includes(Number(genre)));
    }
    if (sortKey === "title-asc") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortKey === "title-desc") {
      data.sort((a, b) => b.title.localeCompare(a.title));
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
                  
                  {/* FIX 2: Replaced the pink div box with the actual podcast cover image */}
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