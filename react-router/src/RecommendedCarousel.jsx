import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SliderFactory from "react-slick";
import { genres } from "./data";
import { PodcastContext } from "./context/PodcastContext";

const Slider = SliderFactory?.default ?? SliderFactory;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * Custom navigation arrow button for sliding the carousel backwards.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onClick - Click handler callback triggered by the slider controller.
 * @returns {JSX.Element} A absolute-positioned back arrow button.
 */
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

/**
 * Custom navigation arrow button for sliding the carousel forwards.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.onClick - Click handler callback triggered by the slider controller.
 * @returns {JSX.Element} An absolute-positioned forward arrow button.
 */
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

/**
 * RecommendedCarousel component that displays an interactive, horizontally scrollable slider interface.
 * It dynamically maps through category genres, pairs each genre with its corresponding primary show metadata 
 * loaded from global `PodcastContext`, and renders layout panels that link users directly to deep show breakdowns.
 *
 * @component
 * @returns {JSX.Element} A responsive sliding card carousel showcasing aggregated genre recommendations.
 */
export default function RecommendedCarousel() {
  const { allPodcasts } = useContext(PodcastContext);
  const navigate = useNavigate();
  
  // 1. Changed hover state to track the Genre ID so the entire card block responds together
  const [hoveredGenreId, setHoveredGenreId] = useState(null);

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
    slidesToShow: 3,   
    slidesToScroll: 1, 
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 900, 
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (!allPodcasts || !allPodcasts.length) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Assembling dynamic dashboard items...</div>;
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "15px 0" }}>
      <h2 style={{ marginBottom: "15px", fontSize: "1.1rem", textAlign: "center", color: "var(--text-main)" }}>
        Recommended Primary Shows per Genre
      </h2>

      <div style={{ position: "relative", padding: "0 36px" }}>
        <Slider {...settings}>
          {recommendedGenres.map((genre) => {
            const isGenreHovered = hoveredGenreId === genre.id;

            return (
              <div key={genre.id} style={{ padding: "0 0.5rem" }}>
                <div
                  // 2. Attach listeners to the outer container to catch hover events early
                  onMouseEnter={() => setHoveredGenreId(genre.id)}
                  onMouseLeave={() => setHoveredGenreId(null)}
                  style={{
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    boxShadow: isGenreHovered ? "0 10px 22px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    
                    // 3. Optional: Smoothly lifts the entire white card housing wrapper container
                    transform: isGenreHovered ? "translateY(-2px)" : "translateY(0)",
                    transition: "transform 0.25s ease-out, box-shadow 0.25s ease-out"
                  }}
                >
                  {/* 4. Added transition and dynamic scaling directly onto the genre title text */}
                  <h3 
                    style={{ 
                      marginBottom: "8px", 
                      fontSize: "0.85rem", 
                      fontWeight: "600", 
                      width: "100%", 
                      textAlign: "left",
                      transform: isGenreHovered ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "left center", // Keeps text anchor locked to the left margin
                      transition: "transform 0.25s ease-out"
                    }}
                  >
                    {genre.title}
                  </h3>

                  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    {genre.shows.map((show) => (
                      <div
                        key={show.id}
                        title={`${show.title} (Seasons: ${show.seasons})`}
                        onClick={() => 
                          navigate(`/show/${show.id}`, { 
                            state: { genres: [genre.title] } 
                          })
                        }
                        style={{
                          width: "200px",
                          height: "200px",
                          minWidth: "200px",
                          minHeight: "200px",
                          background: "var(--background)",
                          borderRadius: "8px",
                          overflow: "hidden",
                          position: "relative",
                          cursor: "pointer",
                          
                          // 5. Card image container scales up seamlessly alongside the text above it
                          transform: isGenreHovered ? "scale(1.04)" : "scale(1)",
                          transition: "transform 0.25s ease-out",
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
            );
          })}
        </Slider>
      </div>
    </div>
  );
}