import "../../assets/images/ex-user1.png";
import "../../assets/images/윤동희.png";
import "../../assets/images/나승엽.png";

import "./ImageSlider.css";
import { useEffect, useState } from "react";

// ✅ 이미지 import (정확한 상대경로)
import image1 from "../../assets/images/ex-user1.png";
import image2 from "../../assets/images/윤동희.png";
import image3 from "../../assets/images/나승엽.png";

const images = [image1, image2, image3];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slider">
      <img src={images[currentIndex]} alt={`slide-${currentIndex}`} className="slide-img" />

      {/* 좌우 화살표 */}
      <button className="arrow left" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#8250;
      </button>

      {/* 인디케이터 */}
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

export default ImageSlider;
