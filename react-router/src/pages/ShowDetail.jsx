import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSinglePodcast } from "../api/fetchPata";
import { Loading, Error, PodcastDetail } from "../components";

/**
 * ShowDetail page component that acts as a container for displaying detailed information about a single podcast.
 * It extracts the podcast ID from the URL parameters and genre metadata from the router location state,
 * triggers an asynchronous API fetch request to load the full show dataset, and handles loading and error states.
 *
 * @component
 * @returns {JSX.Element} The rendered layout containing either a Loading component, an Error alert, or the detailed PodcastDetail view.
 */
export default function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { genres } = location.state || {};

  const [podcast, setPodcast] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSinglePodcast(id, setPodcast, setError, setLoading);
  }, [id]); 
  return (
    <>
      {loading && <Loading message="Loading podcast..." />}

      {error && (
        <Error message={`Error occurred while fetching podcast: ${error}`} />
      )}
      
      {!loading && !error && podcast && (
        <PodcastDetail podcast={podcast} genres={genres} />
      )}
    </>
  );
}