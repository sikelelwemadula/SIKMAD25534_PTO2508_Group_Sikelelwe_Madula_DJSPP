
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSinglePodcast } from "../api/fetchPata";
import { Loading, Error, PodcastDetail } from "../components";

/**
 * ShowDetail page component for displaying detailed information about a single podcast.
 */
export default function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { genres } = location.state || {};

  // FIX 1: Initialize as null instead of an array, since a single podcast is an object
  const [podcast, setPodcast] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSinglePodcast(id, setPodcast, setError, setLoading);
  }, [id]); // FIX 2: Add 'id' here so it updates properly if the route shifts

  return (
    <>
      {loading && <Loading message="Loading podcast..." />}

      {error && (
        <Error message={`Error occurred while fetching podcast: ${error}`} />
      )}
      
      {/* 
        The audio logic links here: your 'podcast' object contains seasons and episodes.
        We pass this data down into <PodcastDetail /> where the UI buttons will map over it.
      */}
      {!loading && !error && podcast && (
        <PodcastDetail podcast={podcast} genres={genres} />
      )}
    </>
  );
}
