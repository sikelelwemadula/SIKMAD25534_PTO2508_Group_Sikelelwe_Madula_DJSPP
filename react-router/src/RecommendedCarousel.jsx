import React, { useContext } from "react";
import SliderFactory from "react-slick";
import { genres } from "./data";
import { PodcastContext } from "./context/PodcastContext";

const Slider = SliderFactory?.default ?? SliderFactory;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 1. Re-adjusted the navigation arrow positioning to sit cleanly outside the wider multi-card container
function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: "-36px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "999px",
        width: "28px",
        height: "28px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 700,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Previous genres"
    >
      ←
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        right: "-36px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "999px",
        width: "28px",
        height: "28px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 700,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="Next genres"
    >
      →
    </button>
  );
}

export default function RecommendedCarousel() {
  const { allPodcasts } = useContext(PodcastContext);

  const recommendedGenres = genres
    .map((genre) => {
      const showMap = new Map(
        (allPodcasts || []).map((show) => [String(show.id), show])
      );

      const matches = genre.shows
        .map((showId) => showMap.get(String(showId)))
        .filter((show) => show && show.image && show.title)
        .slice(0, 1);

      return {
        id: genre.id,
        title: genre.title,
        shows: matches,
      };
    })
    .filter((genre) => genre.shows.length > 0);

  const settings = {
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 3,   // Displays three individual genre cards side-by-side
    slidesToScroll: 1, // Scrolls by 1 genre card per click
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768, // Handles tablet view sizing
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 520, // Drops down gracefully on small mobile screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (!allPodcasts.length) return <div>Assembling dynamic dashboard items...</div>;

  return (
    // 2. Expanded the main max-width bounding box to accommodate 3 side-by-side layout items smoothly
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "15px 0" }}>
      <h2 style={{ marginBottom: "15px", fontSize: "1.1rem", textAlign: "center", color: "#333" }}>
        Recommended Primary Shows per Genre
      </h2>

      <div style={{ position: "relative", padding: "0 36px" }}>
        <Slider {...settings}>
          {recommendedGenres.map((genre) => (
            <div key={genre.id} style={{ padding: "0 6px" }}>
              {/* White background box containing the layout details */}
              <div
                style={{
                  background: "#ffffff",
                  color: "#1a1a1a",
                  borderRadius: "10px",
                  padding: "12px 14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <h3 style={{ marginBottom: "8px", fontSize: "0.85rem", fontWeight: "600", width: "100%", textAlign: "left" }}>
                  {genre.title}
                </h3>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  {genre.shows.map((show) => (
                    <div
                      key={show.id}
                      title={`${show.title} (Seasons: ${show.seasons})`}
                      style={{
                        width: "220px",
                        aspectRatio: "1 / 1",
                        minWidth: 0,
                        background: "#f3f4f6",
                        borderRadius: "8px",
                        overflow: "hidden",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={show.image}
                        alt={show.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                        padding: "6px 8px",
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {show.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
