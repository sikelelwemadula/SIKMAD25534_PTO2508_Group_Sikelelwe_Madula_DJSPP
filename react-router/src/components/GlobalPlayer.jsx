import { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContext";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    updateProgress,
    markEpisodeFinished,
  } = useAudio();
  const audioRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack?.src) {
      return;
    }

    const resumeTime = currentTrack.resumeTime || 0;
    audio.currentTime = resumeTime;
    setElapsed(resumeTime);
    setDuration(0);
  }, [currentTrack?.id, currentTrack?.src, currentTrack?.resumeTime]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack?.src) {
      return;
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentTrack?.src, currentTrack?.id, isPlaying, setIsPlaying]);

  if (!currentTrack?.src) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        background: "#111",
        color: "#fff",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 1000,
      }}
    >
      <strong>{currentTrack.title}</strong>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: "0.85rem" }}>
          {formatTime(elapsed)} / {formatTime(duration)}
        </span>
        <audio
          key={currentTrack.id || currentTrack.src}
          ref={audioRef}
          controls
          autoPlay={isPlaying}
          src={currentTrack.src}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(event) => {
            const nextDuration = event.currentTarget.duration || 0;
            setDuration(nextDuration);
            if (currentTrack.resumeTime && currentTrack.resumeTime < nextDuration) {
              event.currentTarget.currentTime = currentTrack.resumeTime;
              setElapsed(currentTrack.resumeTime);
            }
          }}
          onTimeUpdate={(event) => {
            const nextElapsed = event.currentTarget.currentTime || 0;
            const nextDuration = event.currentTarget.duration || duration;
            setElapsed(nextElapsed);
            updateProgress(currentTrack.id, nextElapsed, nextDuration);
          }}
          onEnded={() => {
            const nextDuration = duration || audioRef.current?.duration || 0;
            updateProgress(currentTrack.id, nextDuration, nextDuration);
            markEpisodeFinished(currentTrack.id);
            setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
}

export default GlobalPlayer;
