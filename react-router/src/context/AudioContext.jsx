import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUDIO_PROGRESS_KEY = "podcast_audio_progress";
const AUDIO_FINISHED_KEY = "podcast_audio_finished";

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

const AudioContext = createContext(null);

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

  const playTrack = (track) => {
    const resumeTime = progressMap[track.id] || 0;
    setCurrentTrack({ ...track, resumeTime });
    setIsPlaying(true);
  };

  const pauseTrack = () => setIsPlaying(false);

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

  const markEpisodeFinished = (episodeId) => {
    if (!episodeId) {
      return;
    }

    setFinishedEpisodes((prev) =>
      prev.includes(episodeId) ? prev : [...prev, episodeId]
    );
  };

  const getEpisodeProgress = (episodeId) => progressMap[episodeId] || 0;
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

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used inside an AudioProvider");
  }

  return context;
}
