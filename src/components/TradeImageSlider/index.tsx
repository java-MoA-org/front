import "./style.css";
import { useEffect, useState } from "react";

interface TradeImageSliderProps {
  images: string[];
}

const TradeImageSlider = ({ images }: TradeImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="slider">
      <img
        src={images[currentIndex]}
        alt={`slide-${currentIndex}`}
        className="slide-img"
      />
      <button className="arrow left" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#8250;
      </button>
      <div className="indicator">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default TradeImageSlider;
