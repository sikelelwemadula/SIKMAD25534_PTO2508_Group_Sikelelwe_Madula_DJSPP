import React, { useState, useEffect } from "react";
import SliderFactory from "react-slick";
import { genres } from "./data";

const Slider = SliderFactory?.default ?? SliderFactory;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: "-44px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "999px",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 700,
        boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
      }}
      aria-label="Previous genre"
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
        right: "-44px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        border: "none",
        background: "#2563eb",
        color: "#fff",
        borderRadius: "999px",
        width: "36px",
        height: "36px",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 700,
        boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
      }}
      aria-label="Next genre"
    >
      →
    </button>
  );
}

export default function RecommendedCarousel() {
  const [recommendedGenres, setRecommendedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://podcast-api.netlify.app")
      .then((res) => res.json())
      .then((allShows) => {
        const showMap = new Map(
          allShows.map((show) => [String(show.id), show])
        );

        const grouped = genres
          .map((genre) => {
            const matches = genre.shows
              .map((showId) => showMap.get(String(showId)))
              .filter(Boolean)
              .slice(0, 3);

            return {
              id: genre.id,
              title: genre.title,
              shows: matches,
            };
          })
          .filter((genre) => genre.shows.length > 0);

        setRecommendedGenres(grouped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed loading podcast metadata:", err);
        setLoading(false);
      });
  }, []);

  const settings = {
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  if (loading) return <div>Assembling dynamic dashboard items...</div>;

  return (
    <div style={{ width: "90%", margin: "0 auto", padding: "10px 0" }}>
      <h2 style={{ marginBottom: "16px" }}>Recommended Primary Shows per Genre</h2>

      <div style={{ position: "relative", padding: "0 36px" }}>
        <Slider {...settings}>
          {recommendedGenres.map((genre) => (
            <div key={genre.id} style={{ padding: "0 8px" }}>
              <div
                style={{
                  background: "#1e1e24",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                }}
              >
                <h3 style={{ marginBottom: "16px", fontSize: "1.15rem" }}>
                  {genre.title}
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "10px",
                  }}
                >
                  {genre.shows.map((show) => (
                    <div
                      key={show.id}
                      style={{
                        background: "#2a2a33",
                        borderRadius: "10px",
                        padding: "10px",
                        minHeight: "190px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <img
                        src={show.image}
                        alt={show.title}
                        style={{
                          width: "100%",
                          maxWidth: "250px",
                          borderRadius: "8px",
                          marginBottom: "10px",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                        }}
                      />
                      <h4 style={{ margin: "0 0 6px", fontSize: "0.88rem" }}>
                        {show.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: "#b3b3b3",
                          fontSize: "0.78rem",
                        }}
                      >
                        Seasons: {show.seasons}
                      </p>
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
