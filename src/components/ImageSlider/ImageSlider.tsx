import "./ImageSlider.css";
import { useEffect, useState } from "react";
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";

const images = [banner1, banner2, banner3];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 이미지 index 상태

  // 다음 이미지로 전환
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // 이전 이미지로 전환
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // 3초마다 자동 슬라이드 전환
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer); // 언마운트 시 타이머 제거
  }, []);

  return (
    <div className="slider">
      {/* 현재 이미지 렌더링 */}
      <img
        src={images[currentIndex]}
        alt={`slide-${currentIndex}`}
        className="slide-img"
      />

      {/* 좌/우 화살표 */}
      <button className="arrow left" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#8250;
      </button>

      {/* 하단 인디케이터 */}
      <div className="indicator">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)} // 점 클릭 시 해당 인덱스로 이동
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
