import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavoriteEpisodes from "./pages/FavouriteEpisodes";
import { PodcastProvider } from "./context/PodcastContext";
import { AudioProvider } from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";

import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import "./styles/theme.css";

/**
 * Root component of the Podcast Web Application.
 * 
 * Orchestrates the global state architecture by nesting multi-provider context layers 
 * (`ThemeProvider`, `AudioProvider`, and `PodcastProvider`) and configures core 
 * client-side page routing configurations alongside persistent layout items.
 *
 * @component
 * @returns {JSX.Element} The baseline application shell containing global state trees, layout shells, and page switches.
 */
export default function App() {
  return (
    <ThemeProvider>
    <AudioProvider>
      <PodcastProvider>
        <div style={{ minHeight: "100vh", position: "relative" }}>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/show/:id" element={<ShowDetail />} />
            <Route path="/favorites" element={<FavoriteEpisodes />} />
          </Routes>

          <GlobalPlayer />
        </div>
      </PodcastProvider>
    </AudioProvider>
    </ThemeProvider>
  );
}