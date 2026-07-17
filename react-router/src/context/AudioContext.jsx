import { createContext, useContext, useMemo, useState } from "react";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => setIsPlaying(false);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      playTrack,
      pauseTrack,
      setIsPlaying,
    }),
    [currentTrack, isPlaying]
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
