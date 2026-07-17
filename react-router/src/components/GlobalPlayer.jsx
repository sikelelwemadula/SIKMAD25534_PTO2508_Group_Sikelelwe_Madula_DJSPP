import { useAudio } from "../context/AudioContext";

export function GlobalPlayer() {
  const { currentTrack, isPlaying, pauseTrack, setIsPlaying } = useAudio();

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
      <audio
        controls
        autoPlay={isPlaying}
        src={currentTrack.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

export default GlobalPlayer;
