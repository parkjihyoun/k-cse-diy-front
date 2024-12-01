import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TutorialPage.module.css';
import mainImage from '../img/main.png'; // 첫 번째 이미지
import calendarImage from '../img/calendar.png'; // 두 번째 이미지
import calendarImage2 from '../img/calendar2.png'; // 세 번째 이미지
import timeImage from '../img/time.png'; // 네 번째 이미지

const TutorialPage = () => {
  const images = [mainImage, calendarImage, calendarImage2, timeImage]; // 이미지 배열
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  useEffect(() => {
    // 자동 전환 기능
    if (currentImageIndex < images.length) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => prevIndex + 1);
      }, 3000);
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    } else {
      // 이미지 전환이 끝나면 HelpPage로 이동
      navigate('/help');
    }
  }, [currentImageIndex, images.length, navigate]);

  // 스킵 버튼 클릭 시 HelpPage로 이동
  const handleSkip = () => {
    navigate('/help');
  };

  // 특정 점 클릭 시 해당 이미지로 이동
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.tutorialPage}>
      {/* 점 표시 */}
      <div className={styles.dotsContainer}>
        {images.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              index === currentImageIndex ? styles.activeDot : ''
            }`}
            onClick={() => handleDotClick(index)} // 점 클릭 이벤트 핸들러
          />
        ))}
      </div>

      {/* 스킵 버튼 */}
      <button className={styles.skipButton} onClick={handleSkip}>
        Skip&gt;&gt;
      </button>

      {/* 이미지 전환 */}
      <div className={styles.imageContainer}>
        {currentImageIndex < images.length && (
          <img
            src={images[currentImageIndex]}
            alt={`Slide ${currentImageIndex + 1}`}
            className={styles.mainImage}
          />
        )}
      </div>
    </div>
  );
};

export default TutorialPage;
