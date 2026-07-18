import React, { useContext, useEffect, useState } from 'react';
// REMOVED: import { Heart } from 'lucide-react'; 
import { PodcastContext } from '../context/PodcastContext';
import { fetchMultiplePodcasts } from '../api/fetchPata';
import { Loading } from '../components';
import styles from './FavouriteEpisodes.module.css';

export default function FavoriteEpisodes() {
  const { favorites, toggleFavorite } = useContext(PodcastContext);
  const [favoriteEpisodesList, setFavoriteEpisodesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoriteEpisodesList([]);
      return;
    }

    const loadFavoriteDetails = async () => {
      setLoading(true);
      
      const showIds = [...new Set(favorites.map(favId => String(favId).split('-')[0]))];
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
                description: episode.description
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

  const groupedFavorites = favoriteEpisodesList.reduce((acc, episode) => {
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

      {Object.keys(groupedFavorites).length === 0 ? (
        <p className={styles.emptyMessage}>You haven't saved any favorite episodes yet.</p>
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

                  {/* FIXED: Uses plain text heart instead of lucide component */}
                  <button 
                    onClick={() => toggleFavorite(episode.id)}
                    className={styles.heartButton}
                    aria-label="Remove from favorites"
                    style={{ fontSize: '24px', color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer' }}
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