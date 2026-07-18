import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavoriteEpisodes from "./pages/FavouriteEpisodes";
import { PodcastProvider } from "./context/PodcastContext";
import { AudioProvider } from "./context/AudioContext";
import GlobalPlayer from "./components/GlobalPlayer";

/**
 * Root component of the Podcast Explorer app.
 *
 * - Wraps the application in the `PodcastProvider` context for global state.
 * - Includes the `Header` component, displayed on all pages.
 * - Defines client-side routes using React Router.
 *
 * @returns {JSX.Element} The application component with routing and context.
 */
export default function App() {
  return (
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
  );
}