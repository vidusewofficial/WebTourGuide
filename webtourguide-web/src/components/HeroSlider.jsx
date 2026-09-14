import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider() {
  const slides = [
    {
      title: "Web Based Tourguide",
      subtitle: "A Human Exploration",
      description: "Discover breathtaking travel destinations, certified local guides, and customized holiday packages across Sri Lanka.",
    },
    {
      title: "Discover Paradise",
      subtitle: "Unforgettable Adventures",
      description: "Explore hidden gems, scenic mountain peaks, pristine tropical beaches, and rich cultural heritage sites.",
    },
    {
      title: "Travel Smart",
      subtitle: "With Expert Guides",
      description: "Plan your personalized journey with safe, verified local tour experts and curated multi-day tour packages.",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }

  return (
    <section className="slider_section">
      <div className="container">
        <div className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="slider_container">
                <div className="box">
                  <div className="detail-box">
                    <h1>{slides[currentSlide].title}</h1>
                    <h2>{slides[currentSlide].subtitle}</h2>
                    <p style={{ color: "#f8f9fa", maxWidth: "550px", marginTop: "15px", fontSize: "1.1rem", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                      {slides[currentSlide].description}
                    </p>
                  </div>
                  <div className="img-box">
                    <div className="play_btn">
                      <Link to="/destinations" title="Explore Destinations">
                        <img src="/images/play.png" alt="Explore" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="custom_carousel-control">
          <button
            className="carousel-control-prev"
            type="button"
            onClick={prevSlide}
            aria-label="Previous"
          >
            <span className="sr-only">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={nextSlide}
            aria-label="Next"
          >
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}
