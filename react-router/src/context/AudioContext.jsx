import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** @type {string} The localStorage key used for saving individual episode play progress timestamps. */
const AUDIO_PROGRESS_KEY = "podcast_audio_progress";

/** @type {string} The localStorage key used for saving the list of completed episode IDs. */
const AUDIO_FINISHED_KEY = "podcast_audio_finished";

/**
 * Safely reads and parses the stored episode playback progress from `localStorage`.
 * Returns an empty object if no data is found or if parsing fails.
 *
 * @returns {Record<string, number>} A map of unique episode IDs to their last saved playback time in seconds.
 */
const readStoredProgress = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(AUDIO_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

/**
 * Safely reads and parses the list of completed episodes from `localStorage`.
 * Returns an empty array if no data is found or if parsing fails.
 *
 * @returns {string[]} An array containing unique IDs of completed podcast episodes.
 */
const readStoredFinished = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(AUDIO_FINISHED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

/**
 * React context instance handling global audio streams and persistent tracking progress states.
 * @type {React.Context<null|Object>}
 */
const AudioContext = createContext(null);

/**
 * Context provider component that wraps the application to manage persistent audio playback.
 * It coordinates track configurations, toggles dynamic playback flags, updates live 
 * timestamps, and synchronizes listening history records with the browser's `localStorage`.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Component child elements to be granted access to the context state values.
 * @returns {JSX.Element} A context provider wrapper injecting audio management properties.
 */
export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMap, setProgressMap] = useState(() => readStoredProgress());
  const [finishedEpisodes, setFinishedEpisodes] = useState(() => readStoredFinished());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUDIO_PROGRESS_KEY, JSON.stringify(progressMap));
    }
  }, [progressMap]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUDIO_FINISHED_KEY, JSON.stringify(finishedEpisodes));
    }
  }, [finishedEpisodes]);

  /**
   * Initializes playback for a requested track, injecting previously saved completion progress if available.
   *
   * @param {Object} track - The track data configuration object.
   * @param {string} track.id - Unique identifier for the specific episode track.
   * @param {string} track.title - The display name of the track.
   * @param {string} track.artist - The show host or author title identity.
   * @param {string} track.src - Stream source audio resource URL.
   */
  const playTrack = (track) => {
    const resumeTime = progressMap[track.id] || 0;
    setCurrentTrack({ ...track, resumeTime });
    setIsPlaying(true);
  };

  /** Pauses the currently active audio track. */
  const pauseTrack = () => setIsPlaying(false);

  /**
   * Dispatches and logs localized timestamp milestones while monitoring ongoing runtime playback.
   * Automatically triggers completion states if the current track reaches its end boundaries.
   *
   * @param {string} episodeId - Unique identifier of the targeting active track entity.
   * @param {number} elapsedTime - Current playhead timestamp mark evaluated in seconds.
   * @param {number} [duration=0] - Total audio runtime boundary length evaluated in seconds.
   */
  const updateProgress = (episodeId, elapsedTime, duration = 0) => {
    if (!episodeId) {
      return;
    }

    setProgressMap((prev) => ({
      ...prev,
      [episodeId]: elapsedTime,
    }));

    if (duration > 0 && elapsedTime >= duration - 2) {
      markEpisodeFinished(episodeId);
    }
  };

  /**
   * Appends an episode ID to the historical completion listing tracker.
   *
   * @param {string} episodeId - Unique identifier for the completed episode.
   */
  const markEpisodeFinished = (episodeId) => {
    if (!episodeId) {
      return;
    }

    setFinishedEpisodes((prev) =>
      prev.includes(episodeId) ? prev : [...prev, episodeId]
    );
  };

  /**
   * Extracts historical runtime playback markers linked with a target episode ID.
   *
   * @param {string} episodeId - Unique identifier for the requested track.
   * @returns {number} The saved playback timestamp mark in seconds, or 0 if never started.
   */
  const getEpisodeProgress = (episodeId) => progressMap[episodeId] || 0;

  /**
   * Inspects verification flags assessing track completion state constraints.
   *
   * @param {string} episodeId - Unique identifier for the target track.
   * @returns {boolean} True if the matching identifier registers inside the historical finished database list.
   */
  const isEpisodeFinished = (episodeId) => finishedEpisodes.includes(episodeId);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      progressMap,
      finishedEpisodes,
      playTrack,
      pauseTrack,
      setIsPlaying,
      updateProgress,
      markEpisodeFinished,
      getEpisodeProgress,
      isEpisodeFinished,
    }),
    [currentTrack, isPlaying, progressMap, finishedEpisodes]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

/**
 * Custom hook providing simple access controls over the active operational global `AudioContext` profile.
 * Throws an explicit error boundary warning if initialization occurs outside a valid provider boundary layout.
 *
 * @throws {Error} If called from a component layer positioned outside an active `AudioProvider` wrapper block.
 * @returns {Object} Context control bindings exposing operational states, stream parameters, and state controllers.
 */
export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used inside an AudioProvider");
  }

  return context;
}