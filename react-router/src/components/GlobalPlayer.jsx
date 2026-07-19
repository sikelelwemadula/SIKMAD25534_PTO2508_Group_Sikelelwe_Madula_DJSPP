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
  const { currentTrack, isPlaying, setIsPlaying } = useAudio();
  const audioRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack?.src) {
      return;
    }

    setElapsed(0);
    setDuration(0);
    audio.currentTime = 0;
  }, [currentTrack?.src]);

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
  }, [currentTrack?.src, isPlaying, setIsPlaying]);

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
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime || 0)}
        />
      </div>
    </div>
  );
}

export default GlobalPlayer;
